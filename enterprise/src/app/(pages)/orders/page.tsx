'use client'

import React, {useEffect} from 'react';
import OrderData from "@/components/page/orders";
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
const Orders = () => {

    return (
        <div>
            <OrderData/>
        </div>
    );
};

export default Orders;