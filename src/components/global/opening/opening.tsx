import { deleteOpening } from "@/actions/opening";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutationData } from "@/hooks/useMutationData";
import { Openings } from "@prisma/client";
import Link from "next/link";
import React from "react";

interface Props {
    opening: Openings;
    organizationId: string;
}

const Opening = ({ opening, organizationId }: Props) => {
    const { toast } = useToast();

    const { mutate, isPending } = useMutationData(
        ["deleteOpening"],
        (data) => deleteOpening(data),
        "get-openings-" + organizationId,
        () =>
            toast({
                title: "Success",
                description: "Opening deleted successfully",
            })
    );

    return (
        <div
            key={opening.id}
            className="flex px-4 py-2 w-full justify-between rounded-xl"
            style={{
                border: "1px solid #333333",
            }}
        >
            <div>
                <h1 className="font-bold">{opening.title}</h1>
                <p className="font-semibold text-sm text-gray-500">{opening.description}</p>
            </div>
            <div className="flex items-center">
                <Link href={`/app/organization/${organizationId}/openings/${opening.id}`}>
                    <Button
                        variant="ghost"
                        className="font-semibold text-blue-600"
                    >
                        View
                    </Button>
                </Link>
                <Button
                    variant="ghost"
                    className="font-semibold text-red-600"
                    onClick={() => {
                        mutate({ id: opening.id });
                    }}
                >
                    {isPending ? "Deleting..." : "Delete"}
                </Button>
            </div>
        </div>
    );
};

export default Opening;
