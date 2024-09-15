
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import VendorForm from "@/components/page/vendor-form";
import {LucidePlusCircle} from "lucide-react";

export function AddVendor() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size={'sm'} className={`h-10 bg-black text-white px-3 flex items-center gap-2`}>  <LucidePlusCircle size={14} strokeWidth={2}/> Add Vendor</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Vendor(s)</DialogTitle>
                    <DialogDescription>
                        You are entitled to add only two vendors at the moment.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                    <VendorForm/>
                    </div>
                </div>
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Later
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
