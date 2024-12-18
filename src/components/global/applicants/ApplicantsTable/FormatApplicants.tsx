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
    // console.log(applicants);
    return (
        <div className="container mx-auto py-10">
            <ApplicantsDataTable
                data={applicants}
                openingDetails={openingDetails}
            />
        </div>
    );
}
