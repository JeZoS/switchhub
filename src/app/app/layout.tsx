import { getOpenings } from "@/actions/opening";
import Navbar from "@/components/global/navbar/navbar";
import Sidebar from "@/components/global/sidebar/sidebar";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import React from "react";

interface Props {
    children: React.ReactNode;
}

const AdminLayout = async (props: Props) => {
    const query = new QueryClient();
    return (
        <HydrationBoundary state={dehydrate(query)}>
            <div className="flex h-screen w-screen">
                <Sidebar />
                <div className="flex flex-col w-full h-full">
                    <Navbar />
                    {props.children}
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default AdminLayout;
