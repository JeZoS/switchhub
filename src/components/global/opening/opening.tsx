import { deleteOpening } from "@/actions/opening";
import { useToast } from "@/hooks/use-toast";
import { useMutationData } from "@/hooks/useMutationData";
import { cn } from "@/lib/utils";
import { Openings } from "@prisma/client";
import { ArrowRightCircle, EditIcon, XCircle } from "lucide-react";
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
            className="flex flex-col py-2 max-w-[10rem] justify-between rounded-sm"
            style={{
                border: "1px solid #333333",
            }}
        >
            <div
                className="px-4 py-2"
                style={{
                    borderBottom: "1px solid #333333",
                }}
            >
                <h1 className="font-bold flex w-full">{opening.title}</h1>
            </div>
            <div className="px-4 py-2 h-[12rem] overflow-y-scroll">
                <p className="font-semibold text-xs text-gray-600">{opening.description}</p>
            </div>
            <div
                className="flex px-4 items-center justify-between gap-2 pt-2"
                style={{
                    borderTop: "1px solid #333333",
                }}
            >
                <Link href={`/app/organization/${organizationId}/openings/${opening.id}`}>
                    <ArrowRightCircle />
                </Link>
                <EditIcon className="cursor-not-allowed" color="gray" />
                <XCircle
                    className={cn("cursor-pointer", isPending && "animate-spin")}
                    onClick={() => {
                        mutate({ id: opening.id });
                    }}
                />
            </div>
        </div>
    );
};

export default Opening;
