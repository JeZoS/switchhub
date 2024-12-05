"use client";

import { getOpenings } from "@/actions/opening";
import Opening from "@/components/global/opening/opening";
import { useQueryData } from "@/hooks/useQueryData";
import { Openings } from "@prisma/client";
import React from "react";

interface Props {
    params: {
        organizationId: string;
    };
}

const page = (props: Props) => {
    const { data, isPending } = useQueryData(["get-openings-" + props.params.organizationId], () =>
        getOpenings({ organizationId: props.params.organizationId })
    );
    const organizationId = props.params.organizationId;
    if (isPending) {
        return <div className="m-4">Loading...</div>;
    }

    const { data: openings } = data as {
        data: Openings[];
    };

    return (
        <div className="mt-4 mx-4">
            <div className="flex flex-wrap gap-4">
                {openings?.map((opening: Openings) => {
                    return (
                        <Opening
                            key={opening.id}
                            opening={opening}
                            organizationId={organizationId}
                        />
                    );
                })}
            </div>
            {/* Openings */}
        </div>
    );
};

export default page;
