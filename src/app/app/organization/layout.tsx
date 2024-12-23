import React from "react";

interface Props {
    children: React.ReactNode;
}

const OrganizationsLayout = (props: Props) => {
    return <div>{props.children}</div>;
};

export default OrganizationsLayout;
