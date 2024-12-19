import { Applicant, Openings } from "@prisma/client";
import { ApplicantsDataTable } from "./ApplicantsDataTable";

export default function FormatApplicants({
    applicants,
    openingDetails,
    // organizationId,
}: {
    applicants: Applicant[];
    openingDetails: Openings;
    organizationId: string;
}) {
    return (
        <div className="mx-auto">
            <ApplicantsDataTable
                data={applicants}
                openingDetails={openingDetails}
            />
        </div>
    );
}
