'use client'

import React, {useEffect} from 'react';
import OrderData from "@/components/page/orders";
import useAuthStore from "@/store/authenticate";
import {useRouter} from "next/navigation";
import {ScaleLoader} from "react-spinners";

const Orders = () => {

    return (
        <div>
            <OrderData/>
        </div>
    );
};

export default Orders;