"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CreateOpening from "../opening/createopening";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import useOrgStore from "@/hooks/useOrganization";
import IntegrateWithZinterview from "../zinterview/intergrateWithZinterview";
import { getOrganization } from "@/actions/organizations";
import ZinterviewSettings from "../zinterview/zinterviewSettings";

const SideBar = () => {
    const { orgId, setOrgId } = useOrgStore((state) => state);

    let pathname = usePathname();
    let pathArray = pathname.trim().split("/");
    let organizationId = pathArray[3];
    let openingId = pathArray[5];

    const getAndUpdateOrgId = async () => {
        if (!organizationId) return;
        const resp = await getOrganization(organizationId);
        if (resp.status === 200) {
            setOrgId(resp.data);
        }
    };

    useEffect(() => {
        if (!orgId.id) {
            getAndUpdateOrgId();
        }
    }, []);

    const SidebarSection = (
        <div
            className="bg-gray-100 flex-none relative h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden"
            style={{
                borderRight: "1px solid #333333",
            }}
        >
            <Link
                className="bg-gray-100 p-4 flex gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0 cursor-pointer"
                style={{
                    borderBottom: "1px solid #333333",
                }}
                href="/app/organization"
            >
                <Image
                    alt="Logo"
                    src="/switch.svg"
                    width={25}
                    height={25}
                    className="rounded-full p-1"
                    style={{
                        border: "1px solid #333333",
                    }}
                />
                <p className="text-2xl">SwitchHub</p>
            </Link>
            <div className="flex flex-col h-full w-full mt-12 p-4">
                {!!organizationId && <p className="self-center my-2">{orgId?.name}</p>}
                {organizationId && openingId && (
                    <Button
                        variant="outline"
                        className="w-full my-1"
                        style={{
                            border: "1px solid #333333",
                        }}
                    >
                        <Link href={`/app/organization/${organizationId}/openings`}>All openings</Link>
                    </Button>
                )}
                {!openingId && organizationId && <CreateOpening organizationId={organizationId} />}
            </div>
            <div
                className="w-full p-4"
                style={{
                    borderTop: "1px solid #333333",
                }}
            >
                {organizationId ? (
                    !orgId.ziOrgId ? (
                        <IntegrateWithZinterview
                            organizationId={organizationId}
                            openingId={openingId}
                        />
                    ) : (
                        <ZinterviewSettings
                            organizationId={organizationId}
                            openingId={openingId}
                        />
                    )
                ) : null}
            </div>
        </div>
    );

    return (
        <div className="full">
            <div className="md:hidden fixed my-4">
                <Sheet>
                    <SheetTrigger
                        asChild
                        className="ml-2"
                    >
                        <Button
                            variant={"ghost"}
                            className="mt-[2px]"
                        >
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side={"left"}
                        className="p-0 w-fit h-full"
                    >
                        {SidebarSection}
                    </SheetContent>
                </Sheet>
            </div>
            <div className="hidden md:block h-full overflow-y-auto">{SidebarSection}</div>
        </div>
    );
};

export default SideBar;
