'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authenticate';
import { ScaleLoader } from 'react-spinners';
import Dashboard from '@/components/page/dashboard';
import NotificationModal from '@/components/page/notification';
import useVendorStore from '@/store/vendors';

const App: React.FC = () => {


    return (
        <div>
            <h1>Coming Soon</h1>

        </div>
    );
};

export default App;
