'use client'
import React, {useEffect} from 'react';
import EmployeeData from "@/components/page/employees";
import useAuthStore from "@/store/authenticate";
import {useRouter} from "next/navigation";
import {ScaleLoader} from "react-spinners";
import {useUserStore} from "@/store/profile";

const Employees = () => {


    return (
        <div>
            <EmployeeData/>
        </div>
    );
};

export default Employees;