"use server";

import { client } from "@/lib/prisma";
import axios from "axios";

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
        console.log(createdApplicant);
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

export const deleteApplicants = async ({ id }: { id: string }) => {};

export const getApplicants = async (id: string) => {};

export const updateApplicants = async (data: { id: string }) => {};

export const getApplicant = async (id: string) => {};

export const updateApplicant = async (data: { id: string }) => {};

export const getZiCandidate = async (id: string, ziOpeningId: string) => {
    try {
        const candidate = await client.applicant.findUnique({
            where: {
                id: id,
            },
        });
        if (!candidate) {
            return {
                status: 404,
                message: "Candidate not found",
            };
        }
        console.log(candidate);
        if (candidate.ziCandidateId) {
            return {
                status: 200,
                data: candidate,
            };
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: "64cd2939e703852ce07e9eadd32b680fc8308700",
            },
        };
        const body = {
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            openingId: ziOpeningId,
        };
        let resp = await axios.post(
            "https://communal-quietly-doberman.ngrok-free.app/api/v1/candidates/create-candidate",
            body,
            config
        );
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