"use client";

import { getOpening } from "@/actions/opening";
import Applicant from "@/components/global/applicants/applicants";
import CreateApplicants from "@/components/global/applicants/createapplicants";
import GenerateZinterviewOpening from "@/components/global/zinterview/generateZinterviewOpening";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
                <h1>Applicants</h1>
                {openingDetails.applicants.map((applicant) => {
                    return (
                        <Applicant
                            key={applicant.id}
                            applicant={applicant}
                            ziOpeningId={openingDetails.ziOpeningId}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default OpeningId;
