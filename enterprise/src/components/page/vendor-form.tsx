"use client"

import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import useVendorStore from '@/store/vendors'
import useAuth from "@/hook/auth"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Define schema for validation
const schema = z.object({
    vendors: z.array(z.string()).min(1, 'At least one vendor must be selected'),
})

// Define type for vendor data
type Vendor = {
    _id: string
    name: string
    location: string
}

// Define type for form data
type FormData = {
    vendors: string[]
}

export default function VendorFormDialog() {
    const [open, setOpen] = React.useState(false)
    const { vendors, fetchVendors, loading } = useVendorStore()
    const { addVendor, success, error } = useAuth()

    const { control, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            vendors: [],
        },
    })

    useEffect(() => {
        fetchVendors()
    }, [fetchVendors])

    useEffect(() => {
        if (success) {
            toast.success(success)
            setOpen(false)
            reset()
        } else if (error) {
            toast.error(error)
        }
    }, [success, error, reset])

    const selectedVendors = watch('vendors')

    const onSubmit = async (data: FormData) => {
        try {
            await addVendor(data.vendors)
            console.log('Selected Vendors:', data.vendors)
        } catch (err) {
            console.error('Error adding vendors:', err)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Add Vendors</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Vendors</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="vendors">Select Vendors</Label>
                        <Controller
                            name="vendors"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={(value) => field.onChange([...field.value, value])}
                                    value={field.value[field.value.length - 1]}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select vendors" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vendors?.map((vendor: Vendor) => (
                                            <SelectItem key={vendor._id} value={vendor._id}>
                                                {`${vendor.name} (${vendor.location})`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.vendors && <p className="text-sm text-red-500">{errors.vendors.message}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {selectedVendors.map((vendorId) => {
                            const vendor = vendors.find((v: Vendor) => v._id === vendorId)
                            return vendor ? (
                                <div key={vendor._id} className="flex items-center gap-2 bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                                    <span>{vendor.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => setValue('vendors', selectedVendors.filter(id => id !== vendorId))}
                                        className="text-secondary-foreground/50 hover:text-secondary-foreground"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : null
                        })}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Vendors'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}