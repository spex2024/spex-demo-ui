'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import Header from "@/components/page/header";
import Footer from "@/components/page/footer";

interface LayoutProps {
    children: ReactNode;
}



const Layout: React.FC<LayoutProps> = ({ children }) => {


    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
};

export default Layout;
