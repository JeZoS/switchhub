import { client } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
    return new Response(JSON.stringify({ message: "Hello, world!" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function POST(request: NextRequest) {
    try {
        const textBody = await request.text();
        const body = JSON.parse(textBody);
        const { isCompleted, candidateId, score } = body;
        // console.log("body", body);ca
        if (isCompleted) {
            const candidate = await client.applicant.findFirst({
                where: {
                    ziCandidateId: candidateId,
                },
            });
            if (candidate) {
                await client.applicant.update({
                    where: {
                        id: candidate.id,
                    },
                    data: {
                        ziInterviewStatus: "COMPLETED",
                        additionalInfo: JSON.stringify({
                            zinterviewScore: score,
                        }),
                    },
                });
            }
        }

        return new Response(JSON.stringify({ message: "Data received successfully", data: body }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error parsing JSON:", error);

        return new Response(JSON.stringify({ error: "Invalid JSON format" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
}
