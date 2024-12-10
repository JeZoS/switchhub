"use server";
import { client } from "@/lib/prisma";
import axios from "axios";

// rendon UUID
// const USER_ID = "123e4567-e89b-12d3-a456-426614174000";
// const ORG_ID = "123a4567-e89b-12d3-a456-426614174000";

export const getOpenings = async ({ organizationId }: { organizationId: string }) => {
    // return {
    //     status: 200,
    //     data: [],
    // };
    try {
        // console.log("fetching openings");
        const openings = await client.openings.findMany({
            where: {
                organizationId: organizationId,
            },
        });
        // console.log(openings);
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

export const createOpening = async (data: {
    title: string;
    // isTechnical: boolean;
    organizationId: string;
}) => {
    try {
        const newOpening = client.openings.create({
            data: {
                title: data.title,
                // isTechnical: data.isTechnical,
                // createdBy: USER_ID,
                organizationId: data.organizationId,
                description: "This is a test description",
                additionalInfo: "Additional information",
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
                    },
                },
                title: true,
                ziOpeningId: true,
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
        const resp = await axios.post(
            "https://communal-quietly-doberman.ngrok-free.app/api/v1/openings/parse-create-opening",
            body,
            config
        );
        // console.log(resp.data);
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
            console.log(updateOpening);
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
