import { getZiCandidate } from "@/actions/applicants";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutationData } from "@/hooks/useMutationData";
import type { Applicant } from "@prisma/client";
import React from "react";

interface Props {
    applicant: Applicant;
    ziOpeningId: string;
}

const Applicant = ({ applicant, ziOpeningId }: Props) => {
    const { toast } = useToast();
    // const { mutate, isPending } = useMutationData(
    //     ["CreateOpening"],
    //     (data) => createOpening(data),
    //     "get-openings",
    //     () => {
    //         toast({
    //             title:"Success",
    //             description: "Opening created successfully",
    //         });
    //         setIsDialogOpen(false);
    //     }
    // );

    const onSubmit = async () => {
        let response = await getZiCandidate(applicant.id, ziOpeningId);
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
            <div>
                <h1>{applicant.firstName + " " + applicant.lastName}</h1>
                <p>{applicant.email}</p>
            </div>
            <div className="flex gap-2">
                {ziOpeningId && !applicant.ziCandidateId && (
                    <Button
                        variant="default"
                        className="hover:scale-110 transition-all"
                        onClick={onSubmit}
                    >
                        Zinterview Link
                    </Button>
                )}
                <Button
                    variant="destructive"
                    className="hover:scale-105 transition-all"
                >
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default Applicant;
