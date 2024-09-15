import React, { ReactNode } from 'react';
import Header from "@/components/page/header";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    );
};

export default Layout;
