"use client";

import { getOpening } from "@/actions/opening";
import Applicant from "@/components/global/applicants/applicants";
import CreateApplicants from "@/components/global/applicants/createapplicants";
import GenerateAndSendZinterviewLink from "@/components/global/zinterview/generateAndSendZinterviewLink";
import GenerateZinterviewOpening from "@/components/global/zinterview/generateZinterviewOpening";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import useCandidateStore from "@/hooks/useCandidates";
import { useQueryData } from "@/hooks/useQueryData";
import { Applicant as ApplicatType } from "@prisma/client";
import React from "react";

interface Props {
    params: { openingId: string };
}

const OpeningId = (props: Props) => {
    const { data, isPending } = useQueryData(["get-opening-" + props.params.openingId], () =>
        getOpening(props.params.openingId)
    );

    const { selectedCandidates, addCandidate, removeCandidate } = useCandidateStore((state) => state);

    const { toast } = useToast();
    if (isPending) {
        return <div className="m-4">Loading...</div>;
    }

    const { data: openingDetails } = data as {
        data: {
            title: string;
            ziOpeningId: string;
            applicants: ApplicatType[];
        };
    };

    return (
        <div className="w-full h-full overflow-y-scroll">
            <div className="flex justify-between items-center p-4">
                <h1 className="text-xl font-bold">{openingDetails.title}</h1>
                <div className="flex gap-2">
                    {selectedCandidates.length > 0 && (
                        <GenerateAndSendZinterviewLink
                            openingDetails={openingDetails}
                            selectedCandidates={selectedCandidates}
                        />
                    )}
                    {openingDetails.ziOpeningId ? (
                        <Button
                            variant="secondary"
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    `https://testbed3.zinterview.ai/interview/${openingDetails.ziOpeningId}`
                                );
                                toast({
                                    title: "Copied",
                                    description: "Zinterview link copied to clipboard",
                                });
                            }}
                            style={{
                                border: "1px solid #333333",
                            }}
                        >
                            Copy Zinterview Link
                        </Button>
                    ) : (
                        <GenerateZinterviewOpening
                            openingDetails={openingDetails}
                            openingId={props.params.openingId}
                        />
                    )}
                    <CreateApplicants openingId={props.params.openingId} />
                </div>
            </div>
            <div className="p-4">
                <div className="flex gap-4 px-[1.1rem] py-1">
                    <input
                        type="checkbox"
                        checked={
                            selectedCandidates.length === openingDetails.applicants.length &&
                            selectedCandidates.length > 0
                        }
                        onChange={(e) => {
                            if (e.target.checked) {
                                openingDetails.applicants.forEach((applicant) => {
                                    addCandidate(applicant.id);
                                });
                            } else {
                                openingDetails.applicants.forEach((applicant) => {
                                    removeCandidate(applicant.id);
                                });
                            }
                        }}
                    />
                    <h1>Applicants</h1>
                </div>
                {openingDetails.applicants.map((applicant) => {
                    return (
                        <Applicant
                            key={applicant.id}
                            applicant={applicant}
                            ziOpeningId={openingDetails.ziOpeningId}
                            onCheckBoxClick={(isChecked: boolean) => {
                                console.log(isChecked);
                                if (isChecked) {
                                    addCandidate(applicant.id);
                                } else {
                                    removeCandidate(applicant.id);
                                }
                            }}
                            isChecked={selectedCandidates.includes(applicant.id)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default OpeningId;
