"use client";

import { getZiCandidate } from "@/actions/applicants";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import useCandidateStore from "@/hooks/useCandidates";
import { Openings } from "@prisma/client";
// import { ColumnDef } from "@tanstack/react-table";
import { Edit, X, XCircle } from "lucide-react";
import { useState } from "react";

export const useGetColumns = ({ openingDetails }: { openingDetails: Openings }) => {
    const { selectedCandidates, addCandidate, removeCandidate } = useCandidateStore((state) => state);
    const { toast } = useToast();
    const [loading, setLoading] = useState({
        state: false,
        id: null,
    });
    const onSubmit = async (applicantId) => {
        // console.log(applicantId, openingDetails);
        // return
        try {
            setLoading({
                state: true,
                id: applicantId,
            });
            const response = await getZiCandidate(applicantId, openingDetails.ziOpeningId);
            if (response.status === 200) {
                navigator.clipboard.writeText(
                    `https://testbed3.zinterview.ai/interview/${openingDetails.ziOpeningId}/start/${response.data?.ziCandidateId}`
                );
                toast({
                    title: "Success",
                    description: "Candidate Zinterview link copied successfully",
                });
            } else {
                toast({
                    title: "Error",
                    description: "Error generating candidate Zinterview link",
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading({
                state: false,
                id: null,
            });
        }
    };

    const cols = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value);
                        let allrows = table.getRowModel().rows;
                        if (value) {
                            allrows.forEach((row) => {
                                addCandidate(row.original.id);
                            });
                        } else {
                            allrows.forEach((row) => {
                                removeCandidate(row.original.id);
                            });
                        }
                    }}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        row.toggleSelected(!!value);
                        if (value) {
                            addCandidate(row.original.id);
                        } else {
                            removeCandidate(row.original.id);
                        }
                    }}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "firstName",
            header: "Name",
            cell: (row) => {
                return `${row.row.original.firstName} ${row.row.original.lastName}`;
            },
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "ziInterviewStatus",
            header: "ZInterview Details",

            cell: (row) => {
                const getStatus = (additionalInfo) => {
                    let score = null;
                    let status = null;
                    if (additionalInfo) {
                        additionalInfo = JSON.parse(additionalInfo);
                        if (additionalInfo.zinterviewDetails) {
                            let zinterviewDetails = JSON.parse(additionalInfo.zinterviewDetails);
                            if (zinterviewDetails) {
                                score = zinterviewDetails.score;
                                status = zinterviewDetails.interviewStatus;
                            }
                        }
                    }
                    // console.log("status", additionalInfo, status, score);
                    switch (status) {
                        case "Interview Completed":
                            return (
                                <>
                                    <span className="text-sm px-2 py-1 rounded-md bg-green-100 border border-green-300">
                                        {status}
                                    </span>
                                    {score != null && (
                                        <span className="flex justify-center items-center border border-yellow-300 py-1 px-2 rounded-md bg-yellow-100">
                                            Score: {score}
                                        </span>
                                    )}
                                </>
                            );
                        case "PENDING":
                            return (
                                <span className="text-sm px-2 py-1 rounded-md bg-yellow-100 border border-yellow-300">
                                    {status}
                                </span>
                            );
                        default:
                            return (
                                <span className="text-sm px-2 py-1 rounded-md bg-gray-100 border border-gray-300">
                                    {status || "UNKNOWN"}
                                </span>
                            );
                    }
                };
                return (
                    <div className="flex justify-start items-center gap-2">
                        {getStatus(row.row.original.additionalInfo)}
                    </div>
                );
            },
        },
        {
            id: "CandidateActions",
            header: "Actions",
            cell: (row) => {
                const getStatus = (additionalInfo) => {
                    let score = null;
                    let status = null;
                    if (additionalInfo) {
                        additionalInfo = JSON.parse(additionalInfo);
                        if (additionalInfo.zinterviewDetails) {
                            let zinterviewDetails = JSON.parse(additionalInfo.zinterviewDetails);
                            if (zinterviewDetails) {
                                score = zinterviewDetails.score;
                                status = zinterviewDetails.interviewStatus;
                            }
                        }
                    }
                    return status;
                };

                return (
                    <div className="flex justify-start items-center gap-2">
                        {openingDetails.ziOpeningId && (
                            <Button
                                size="sm"
                                className="bg-white border border-black text-black hover:bg-white hover:text-black"
                                onClick={() => {
                                    if (
                                        getStatus(row.row.original.additionalInfo) === "Interview Completed"
                                    ) {
                                        try {
                                            navigator?.clipboard?.writeText(
                                                `localhost:3001/admin/evaluation/${row.row.original.ziCandidateId}?openingId=${openingDetails.ziOpeningId}`
                                            );
                                            toast({
                                                title: "Copied",
                                                description: "Evaluation link copied to clipboard",
                                            });
                                        } catch (error) {
                                            console.log(error);
                                        }
                                        return;
                                    }
                                    onSubmit(row.row.original.id);
                                }}
                            >
                                {getStatus(row.row.original.additionalInfo) === "Interview Completed"
                                    ? "Evaluation Link"
                                    : "Zinterview Link"}
                            </Button>
                        )}
                        <Edit className="cursor-not-allowed text-gray-400 hover:scale-110 transition-all" />
                        <XCircle className="cursor-not-allowed text-gray-400 hover:scale-110 transition-all" />
                        {/* <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Delete
                </button> */}
                    </div>
                );
            },
        },
    ];

    if (!openingDetails.ziOpeningId) {
        cols.splice(3, 1);
    }

    return cols;
};
