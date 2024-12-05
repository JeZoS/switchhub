"use client";

import useOrgStore from "@/hooks/useOrganization";
import { redirect } from "next/navigation";

interface Props {
    params: {
        organizationId: string;
    };
}

const OrganizationIdPage = (props: Props) => {
    let orgId = props.params.organizationId;
    redirect(`/app/organization/${orgId}/openings`);
};

export default OrganizationIdPage;
