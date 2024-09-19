'use client'
import React, {useEffect} from 'react';
import Vendors from "@/components/page/vendors";
import useAuthStore from "@/store/authenticate";
import {useRouter} from "next/navigation";
import {ScaleLoader} from "react-spinners";

const Vendor = () => {
    return (
        <div>
            <Vendors/>
        </div>
    );
};

export default Vendor;