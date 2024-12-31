"use server";
import { client } from "@/lib/prisma";
import axios from "axios";
const ZI_API_URL = "https://app.zinterview.ai/api/v1";

export const getOpenings = async ({ organizationId }: { organizationId: string }) => {
    try {
        const openings = await client.openings.findMany({
            where: {
                organizationId: organizationId,
            },
        });
        return {
            status: 200,
            data: openings,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: "Internal Server Error",
        };
    }
};

export const createOpening = async (data: { title: string; description: string; organizationId: string }) => {
    console.log(data);
    try {
        const newOpening = client.openings.create({
            data: {
                title: data.title,
                // isTechnical: data.isTechnical,
                // createdBy: USER_ID,
                organizationId: data.organizationId,
                description: data.description || "This is a test description",
                additionalInfo: JSON.stringify({}),
                duration: 30,
            },
        });
        return {
            status: 200,
            data: newOpening,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: "Internal Server Error",
        };
    }
};

export const deleteOpening = async ({ id }: { id: string }) => {
    try {
        const deletedOpening = await client.openings.delete({
            where: {
                id,
            },
        });
        return {
            status: 200,
            data: deletedOpening,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: "Internal Server Error",
        };
    }
};

export const getOpening = async (id: string) => {
    try {
        const opening = await client.openings.findUnique({
            where: {
                id,
            },
            select: {
                applicants: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        id: true,
                        ziInterviewStatus: true,
                        ziCandidateId: true,
                        additionalInfo: true,
                    },
                },
                title: true,
                ziOpeningId: true,
                description: true,
            },
        });
        return {
            status: 200,
            data: opening,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: "Internal Server Error",
        };
    }
};

export const createZinterviewOpening = async (data: {
    openingId: string;
    JD: string;
    isTechnical: boolean;
    // apiKey: string;
}) => {
    try {
        const opening = await client.openings.findUnique({
            where: {
                id: data.openingId,
            },
            select: {
                organization: {
                    select: {
                        ziOrgId: true,
                        ziOrgApiKey: true,
                    },
                },
            },
        });

        if (!opening) {
            return {
                status: 404,
                message: "Opening not found",
            };
        }

        if (!opening.organization.ziOrgApiKey) {
            return {
                status: 404,
                message: "Zinterview API Key not found",
            };
        }

        const apiKey = opening.organization.ziOrgApiKey;

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: apiKey,
            },
        };
        const body = {
            jobDescription: data.JD,
            isTechnical: data.isTechnical,
        };
        const resp = await axios.post(ZI_API_URL + "/openings/parse-create-opening", body, config);
        if (resp.status === 200) {
            const openingId = resp.data.opening._id;
            const updateOpening = await client.openings.update({
                where: {
                    id: data.openingId,
                },
                data: {
                    ziOpeningId: openingId,
                },
            });
            return {
                status: 200,
                data: updateOpening,
            };
        } else {
            return {
                status: 500,
                message: "Internal Server Error",
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: "Internal Server Error",
        };
    }
};
