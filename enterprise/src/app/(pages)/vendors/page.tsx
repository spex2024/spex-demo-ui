'use client'
import React, {useEffect} from 'react';
import Vendors from "@/components/page/vendors";
import useAuthStore from "@/store/authenticate";
import {useRouter} from "next/navigation";
import {ScaleLoader} from "react-spinners";
interface User {
    packs?: number;
    subscription?: string;
    isActive?: boolean;
}

interface UserStore {
    user?: User;
    fetchUser: () => Promise<void>;
}
const Vendor = () => {
    return (
        <div>
            <Vendors/>
        </div>
    );
};

export default Vendor;