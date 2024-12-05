"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

interface Props {
    children: React.ReactNode;
}

const client = new QueryClient();

const ReactQueryProvider = (props: Props) => {
    return (
        <QueryClientProvider client={client}>
            {props.children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default ReactQueryProvider;
