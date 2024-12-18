"use client";

import { deleteOrganization, getOrganizations } from "@/actions/organizations";
import CreateOrganization from "@/components/global/organization/createOrganization";
import { useToast } from "@/hooks/use-toast";
import { useMutationData } from "@/hooks/useMutationData";
import useOrgStore from "@/hooks/useOrganization";
import { useQueryData } from "@/hooks/useQueryData";
import { Organization as PrismaOrganization } from "@prisma/client";
import { Loader, X } from "lucide-react";

interface Organization extends PrismaOrganization {
    _count: {
        openings: number;
    };
}
import Link from "next/link";
import React from "react";

const OrganizationsPage = () => {
    const { data, isPending } = useQueryData(["get-organizations"], () => getOrganizations());
    const { setOrgId } = useOrgStore((state) => state);

    if (isPending) {
        return <div className="m-4">Loading...</div>;
    }

    const { data: organizations, status } = data as { data: Organization[]; status: number };

    return (
        <div className="m-4 flex flex-col h-full">
            <div className="flex justify-between items-center">
                <h1>Organizations</h1>
                <CreateOrganization />
            </div>
            <div className="flex w-full justify-center">
                {!!organizations?.length ||
                    (status !== 200 && <div className="m-4 items-center self-center">No data found</div>)}
            </div>
            <div className="flex flex-wrap py-2 my-2">
                {organizations?.map((organization: Organization) => {
                    return (
                        <SingleOrg
                            key={organization.id}
                            organization={organization}
                            setOrgId={setOrgId}
                        />
                    );
                })}
                {
                    organizations.length === 0 && <div className="w-full h-full flex items-center justify-center self-center">No data found</div>
                }
            </div>
        </div>
    );
};

export default OrganizationsPage;

const SingleOrg = ({ organization, setOrgId }) => {
    const { toast } = useToast();
    const { mutate, isPending: isOrganizationPending } = useMutationData(
        ["deleteOrganization"],
        (data) => deleteOrganization(data),
        "get-organizations",
        () =>
            toast({
                title: "Success",
                description: "Organization deleted successfully",
            })
    );
    return (
        <div
            key={organization.id}
            className="px-4 py-2 my-2 flex gap-4 ml-4 rounded-md hover:bg-gray-100 hover:scale-105"
            style={{
                border: "1px solid #333333",
            }}
        >
            <Link
                href={`/app/organization/${organization.id}`}
                onClick={() => {
                    setOrgId(organization);
                }}
                className="flex gap-2 justify-center items-center"
            >
                <h1 className="font-bold">{organization.name}</h1>
                {!!organization._count.openings && (
                    <p className="font-semibold mt-[2px] text-sm text-gray-500">
                        {organization._count.openings}
                    </p>
                )}{" "}
            </Link>
            {!isOrganizationPending ? (
                <X
                    className="text-red-600 cursor-pointer"
                    onClick={() => {
                        mutate({ id: organization.id });
                    }}
                />
            ) : (
                <Loader className="animate-spin" />
            )}
        </div>
    );
};
