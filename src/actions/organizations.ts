"use server";
import { client } from "@/lib/prisma";
import axios from "axios";

export const createOrganization = async ({ name }: { name: string }) => {
    try {
        const organization = await client.organization.create({
            data: {
                name: name,
            },
        });
        return {
            status: 200,
            data: organization,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: "Internal Server Error",
        };
    }
};

export const getOrganizations = async () => {
    try {
        const organizations = await client.organization.findMany({
            include: {
                _count: {
                    select: {
                        openings: true,
                    },
                },
            },
        });
        return {
            status: 200,
            data: organizations,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: "Internal Server Error",
        };
    }
};

export const getOrganization = async (id: string) => {
    try {
        const organization = await client.organization.findUnique({
            where: {
                id,
            },
        });
        return {
            status: 200,
            data: organization,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: "Internal Server Error",
        };
    }
};

export const createZinterviewOrganization = async (data: { orgId: string; name: string }) => {};

export const updateZiOrgId = async (data: { id: string; ziOrgId: string }) => {};

export const updateZinterviewOrganization = async (data: { ApiKey: string; orgId: string }) => {
    try {
        const config = {
            headers: {
                Authorization: data.ApiKey,
            },
        };

        let resp = await axios.get(
            "https://communal-quietly-doberman.ngrok-free.app/api/v1/organization/get-organization-details",
            config
        );
        if (resp && resp.data && resp.data.data && resp.data.data._id) {
            const org = await client.organization.update({
                where: {
                    id: data.orgId,
                },
                data: {
                    ziOrgId: resp.data.data._id,
                    ziOrgApiKey: data.ApiKey,
                },
            });
            return {
                status: 200,
                data: org,
            };
        }
        return {
            status: 500,
            message: "Internal Server Error",
        };
    } catch (error) {
        return {
            status: 500,
            message: "Internal Server Error",
        };
    }
};

export const updateZinterviewSettings = async (data: { orgId: string; apiKey: any }) => {
    try {
        const org = await client.organization.update({
            where: {
                id: data.orgId,
            },
            data: {
                ziOrgApiKey: data.apiKey,
            },
        });
        return {
            status: 200,
            data: org,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: "Internal Server Error",
        };
    }
};
