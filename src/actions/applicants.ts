"use server";

import { client } from "@/lib/prisma";
import axios from "axios";
const ZI_API_URL = "https://app.zinterview.ai/api/v1";
// const ZI_API_URL = "https://communal-quietly-doberman.ngrok-free.app/api/v1";

export const createApplicantsAndSendInterviewMail = async (data: {
    subject: string;
    body: string;
    openingId: string;
    selectedCandidates: string[];
}) => {
    try {
        let selectedApplicants = await client.applicant.findMany({
            where: {
                id: {
                    in: data.selectedCandidates,
                },
                ziCandidateId: null,
                openingId: data.openingId,
            },
            select: {
                firstName: true,
                lastName: true,
                email: true,
            },
        });
        let organization = await client.openings.findUnique({
            where: {
                id: data.openingId,
            },
            select: {
                organization: {
                    select: {
                        ziOrgApiKey: true,
                    },
                },
                ziOpeningId: true,
            },
        });
        if (selectedApplicants.length === 0) {
            return {
                status: 400,
                message: "Candidates Already Created In Zinterview",
            };
        }

        const body = {
            candidates: selectedApplicants,
            openingId: organization.ziOpeningId,
        };

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: organization.organization.ziOrgApiKey,
            },
        };

        const resp = await axios.post(ZI_API_URL + "/candidates/create-candidates", body, config);
        const zinterviewIds = [];
        if (resp && resp.data && resp.data.data) {
            let candidates = resp.data.data;
            for (let i = 0; i < candidates.length; i++) {
                zinterviewIds.push(candidates[i]._id);
                await client.applicant.updateMany({
                    where: {
                        id: {
                            in: data.selectedCandidates,
                        },
                        email: candidates[i].email,
                    },
                    data: {
                        ziCandidateId: candidates[i]._id,
                    },
                });
            }
        }
        if (zinterviewIds.length > 0) {
            let body = {
                subject: data.subject,
                body: data.body,
                to: zinterviewIds.join(","),
                bodyType: "text",
            };
            axios.post(ZI_API_URL + "/email/send-email", body, config);
        }
        return {
            status: 200,
            message: "Candidates Created Successfully",
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: "Internal Server Error",
        };
    }
};

export const createApplicants = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    openingId: string;
}) => {
    try {
        const createdApplicant = await client.applicant.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                openingId: data.openingId,
            },
        });
        return {
            status: 200,
            data: createdApplicant,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: "Internal Server Error",
        };
    }
};

// export const deleteApplicants = async ({ id }: { id: string }) => {};

// export const getApplicants = async (id: string) => {};

// export const updateApplicants = async (data: { id: string }) => {};

// export const getApplicant = async (id: string) => {};

// export const updateApplicant = async (data: { id: string }) => {};

export const getZiCandidate = async (id: string, ziOpeningId: string) => {
    try {
        const candidate = await client.applicant.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                ziCandidateId: true,
                opening: {
                    select: {
                        id: true,
                        ziOpeningId: true,
                        organization: {
                            select: {
                                ziOrgApiKey: true,
                            },
                        },
                    },
                },
            },
        });
        if (!candidate) {
            return {
                status: 404,
                message: "Candidate not found",
            };
        }
        if (candidate.ziCandidateId) {
            return {
                status: 200,
                data: candidate,
            };
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: candidate.opening.organization.ziOrgApiKey,
            },
        };
        const body = {
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            openingId: ziOpeningId,
        };
        const resp = await axios.post(ZI_API_URL + "/candidates/create-candidate", body, config);
        if (resp.data && resp.data.data && resp.data.data._id) {
            await client.applicant.update({
                where: {
                    id: id,
                },
                data: {
                    ziCandidateId: resp.data.data._id,
                },
            });
        } else {
            return {
                status: 500,
                message: "Error creating candidate",
            };
        }
        return {
            status: 200,
            data: { ...candidate, ziCandidateId: resp.data.data._id },
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: "Internal Server Error",
        };
    }
};
