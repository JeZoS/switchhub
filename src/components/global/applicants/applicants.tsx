import { getZiCandidate } from "@/actions/applicants";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
// import { useMutationData } from "@/hooks/useMutationData";
import type { Applicant } from "@prisma/client";
import React from "react";

interface Props {
    applicant: Applicant;
    ziOpeningId: string;
    isChecked?: boolean;
    onCheckBoxClick?: (state: boolean) => void;
}

const Applicant = ({ applicant, ziOpeningId, isChecked, onCheckBoxClick }: Props) => {
    const { toast } = useToast();
    // const { mutate, isPending } = useMutationData(
    //     ["CreateOpening"],
    //     (data) => createOpening(data),
    //     "get-opening-" + applicant.openingId,
    //     () => {
    //         toast({
    //             title: "Success",
    //             description: "Opening created successfully",
    //         });
    //         // setIsDialogOpen(false);
    //     }
    // );

    const onSubmit = async () => {
        const response = await getZiCandidate(applicant.id, ziOpeningId);
        if (response.status === 200) {
            navigator.clipboard.writeText(
                `https://testbed3.zinterview.ai/interview/${ziOpeningId}/start/${response.data?.ziCandidateId}`
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
    };

    return (
        <div
            key={applicant.id}
            className="flex justify-between items-center px-4 py-2 my-2 border-2 rounded-xl"
        >
            <div className="flex gap-4 items-center">
                <div>
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => onCheckBoxClick && onCheckBoxClick(e.target.checked)}
                    />
                </div>
                <div>
                    <h1>{applicant.firstName + " " + applicant.lastName}</h1>
                    <p>{applicant.email}</p>
                </div>
            </div>
            <div className="flex gap-2">
                {ziOpeningId && applicant.ziInterviewStatus !== "COMPLETED" && (
                    <Button
                        variant="ghost"
                        className="hover:scale-110 transition-all text-blue-600"
                        onClick={onSubmit}
                    >
                        Zinterview Link
                    </Button>
                )}
                {applicant.ziInterviewStatus === "COMPLETED" && (
                    <Button
                        className=" bg-white text-black font-semibold text-sm flex items-center justify-center px-2 rounded-lg hover:bg-white hover:scale-105 transition-all"
                        style={{
                            border: "1px solid #dcdcdc",
                        }}
                        onClick={() => {
                            navigator.clipboard.writeText(
                                `localhost:3001/admin/evaluation/${applicant.ziCandidateId}?openingId=${ziOpeningId}`
                            );
                            toast({
                                title: "Copied",
                                description: "Evaluation link copied to clipboard",
                            });
                        }}
                    >
                        Zinterview Completed
                    </Button>
                )}
                <Button
                    variant="ghost"
                    className="hover:scale-105 transition-all text-rose-500"
                >
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default Applicant;
