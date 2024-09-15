'use client'

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Select, { MultiValue } from 'react-select';
import { toast } from 'react-hot-toast';
import useVendorStore from '@/store/vendors';
import useAuth from "@/hook/auth";

// Define schema for validation
const schema = z.object({
    vendors: z.array(z.string()).min(1, 'At least one vendor must be selected'),
});

// Define type for vendor data
type Vendor = {
    _id: string;
    name: string;
    location: string;
};

// Define type for select options
type OptionType = {
    value: string;
    label: string;
};

// Define type for form data
type FormData = {
    vendors: string[];
};

interface VendorFormProps {
    onClose?: () => void;
}

function VendorForm({ onClose }: VendorFormProps) {
    const { vendors, fetchVendors, loading } = useVendorStore();
    const { addVendor, success, error } = useAuth();

    useEffect(() => {
        fetchVendors();
    }, []);

    useEffect(() => {
        if (success) {
            toast.success(success);
            if (onClose) {
                onClose();
            }
        } else if (error) {
            toast.error(error);
        }
    }, [success, error]);

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            vendors: [],
        },
    });

    const selectedVendors = watch('vendors');

    const onSubmit = async (data: FormData) => {
        try {
            await addVendor(data.vendors);
            console.log('Selected Vendors:', data.vendors);
        } catch (err) {
            console.error('Error adding vendors:', err);
        }
    };

    // Transform vendor data into select options
    const vendorOptions: OptionType[] = vendors?.map((vendor: Vendor) => ({
        value: vendor?._id,
        label: `${vendor?.name} (${vendor?.location})`,
    }));


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <div className="w-full flex flex-col">
                <Controller
                    name="vendors"
                    control={control}
                    render={({ field }) => (
                        <Select<OptionType, true>
                            {...field}
                            options={vendorOptions}
                            isMulti
                            onChange={(selectedOptions: MultiValue<OptionType>) =>
                                setValue('vendors', selectedOptions.map(option => option.value))
                            }
                            value={vendorOptions.filter(option => selectedVendors.includes(option.value))}
                            placeholder="Select vendors"
                            isSearchable
                            className="basic-single"
                            classNamePrefix="select"
                            noOptionsMessage={() => "No vendors found"}
                            styles={{
                                menu: (provided) => ({
                                    ...provided,
                                    zIndex: 9999,
                                    position: 'absolute',
                                    top: '100%',
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                }),
                                menuList: (provided) => ({
                                    ...provided,
                                    padding: 0,
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                }),
                            }}
                        />
                    )}
                />
                {errors.vendors && <p className="text-red-500">{errors.vendors.message}</p>}
            </div>
            <button type="submit" className="bg-black text-white py-2 px-4">Submit</button>
        </form>
    );
}

export default VendorForm;
