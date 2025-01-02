import * as React from "react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Organization } from "@prisma/client";
import { redirect, usePathname } from "next/navigation";
import useOrgStore from "@/hooks/useOrganization";

interface Props {
    organizations: Organization[];
}

const SelectOrganization = ({ organizations }: Props) => {
    const { orgId, setOrgId } = useOrgStore((state) => state);
    const onChange = (orgId: string) => {
        setOrgId(organizations.find((org) => org.id === orgId));
        redirect(`/app/organization/${orgId}/openings`);
    };

    return (
        <Select
            onValueChange={(value) => onChange(value)}
            defaultValue={orgId.id}
        >
            <SelectTrigger className="w-[100%] bg-white">
                <SelectValue placeholder="Select Organization" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Organizations</SelectLabel>
                    {organizations?.map((organization) => (
                        <SelectItem
                            key={organization.id}
                            value={organization.id}
                        >
                            {organization.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default SelectOrganization;
