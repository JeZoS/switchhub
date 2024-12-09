"use client";

import { usePathname } from "next/navigation";
import React from "react";

interface Props {}

const Navbar = (props: Props) => {
    const path = usePathname();

    let title = "Organizations";
    let pathname = usePathname();
    let pathArray = pathname.trim().split("/");
    let organizationId = pathArray[3];
    let openingId = pathArray[5];
    if (organizationId) {
        title = "Organization";
    }
    if (openingId || pathArray[4] === "openings") {
        title = "Opening";
    }

    return (
        <div
            className="w-full h-[4.05rem] pl-14 md:pl-4 capitalize flex p-4 items-center"
            style={{
                borderBottom: "1px solid #333",
            }}
        >
            {title}
        </div>
    );
};

export default Navbar;
