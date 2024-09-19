'use client';

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { LucideEdit3 } from 'lucide-react';
import useAuth from "@/app/hook/auth";

// Zod schema with optional email for updating a vendor
const schema = z.object({
    company: z.string().nonempty('Company name is required'),
    location: z.string().nonempty('Location is required'),
    email: z.string().optional(), // Optional email
    phone: z.string().nonempty('Phone number is required'),
    owner: z.string().nonempty('Owner name is required'),
    profilePhoto: z.any().optional(), // Optional profile photo
});

type UpdateVendorFormInputs = z.infer<typeof schema>;

// Define vendor type
interface Vendor {
    _id: string;
    name: string;
    location: string;
    email?: string;
    phone: string;
    owner: string;
    imageUrl?: string;
}

interface UpdateVendorProps {
    vendor: Vendor;
}

const UpdateVendorForm: React.FC<UpdateVendorProps> = ({ vendor }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<UpdateVendorFormInputs>({
        resolver: zodResolver(schema),
    });

    const { updateVendor, success, error } = useAuth();

    useEffect(() => {
        if (success) {
            toast.success(success);
            setDialogOpen(false); // Close dialog on success
        } else if (error) {
            toast.error(error);
        }
    }, [success, error]);

    useEffect(() => {
        if (vendor) {
            reset({
                company: vendor.name || '',
                location: vendor.location || '',
                email: vendor.email || '',
                phone: vendor.phone || '',
                owner: vendor.owner || '',
                profilePhoto: null, // No default profile photo; handle this differently if needed
            });
        }
    }, [vendor, reset]);

    const onSubmit: SubmitHandler<UpdateVendorFormInputs> = async (data) => {
        const formData = new FormData();
        formData.append('company', data.company);
        formData.append('location', data.location);
        formData.append('phone', data.phone);
        formData.append('owner', data.owner);

        // Append email if provided
        if (data.email) {
            formData.append('email', data.email);
        }

        // Append profile photo if selected
        if (data.profilePhoto && data.profilePhoto[0]) {
            formData.append('profilePhoto', data.profilePhoto[0]);
        }

        try {
            // Assuming updateVendor is used for updating vendor details
            await updateVendor(vendor._id, formData);
            reset();
        } catch (error) {
            console.error('Error updating the vendor:', error);
        }
    };

    const profilePhoto = watch('profilePhoto');

    const inputClass = 'w-full flex-1 appearance-none border border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 text-sm focus:outline-none';
    const errorClass = 'text-red-500';

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="w-[50%] rounded-none p-0 bg-black text-white flex items-center justify-center gap-2 "
                >
                    <LucideEdit3 size={16} /> update profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Update Vendor Information</DialogTitle>
                    <DialogDescription>
                        Update the vendor details by filling the form below.
                    </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-2 pt-3 md:pt-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col pt-4">
                        <Input type="text" {...register('company')} className={inputClass} placeholder="Vendor / Restaurant" />
                        {errors.company && <p className={errorClass}>{errors.company.message}</p>}
                    </div>
                    <div className="flex flex-col pt-4">
                        <Input type="text" {...register('location')} className={inputClass} placeholder="Location" />
                        {errors.location && <p className={errorClass}>{errors.location.message}</p>}
                    </div>
                    <div className="flex flex-col pt-4">
                        <Input type="email" {...register('email')} className={inputClass} placeholder="john@gcb.org" />
                    </div>
                    <div className="flex flex-col pt-4">
                        <Input type="tel" {...register('phone')} className={inputClass} placeholder="Phone" />
                        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                    </div>
                    <div className="flex flex-col pt-4">
                        <Input type="text" {...register('owner')} className={inputClass} placeholder="Owner" />
                        {errors.owner && <p className={errorClass}>{errors.owner.message}</p>}
                    </div>
                    <div className="flex items-center space-x-6 pt-4">
                        <div className="shrink-0">
                            <img
                                id="preview_img"
                                className="h-10 w-10 object-cover rounded-full border-2 border-black"
                                src={profilePhoto?.length ? URL.createObjectURL(profilePhoto[0]) : vendor.imageUrl || 'https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png'}
                                alt="Profile photo preview"
                            />
                        </div>
                        <label className="block">
                            <span className="sr-only">Choose profile photo</span>
                            <input
                                type="file"
                                {...register("profilePhoto")}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            />
                        </label>
                    </div>
                    <DialogFooter className="mt-10">
                        <Button type="submit" className="bg-gray-900 px-4 py-2 text-base font-semibold text-white shadow-md">
                            Update Vendor
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateVendorForm;