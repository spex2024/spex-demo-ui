// components/NotificationModal.tsx
'use client'

import React from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import VendorForm from "@/components/page/vendor-form"

interface NotificationModalProps {
    open: boolean
    onClose: (open: boolean) => void
}

const NotificationModal: React.FC<NotificationModalProps> = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={() => onClose(false)} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            />

            <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
                <DialogPanel
                    transition
                    className="w-full max-w-lg md:max-w-xl lg:max-w-xl h-auto max-h-[80vh] relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all"
                >
                    <div className="px-6 pb-6 pt-5 sm:p-6">
                        <div className="flex items-start">
                            <div className="w-full text-left">
                                <DialogTitle as="h3" className="text-2xl font-semibold leading-tight text-gray-900">
                                    Add Vendor(s) to Your Enterprise
                                </DialogTitle>
                                <p className="mt-2 text-sm text-gray-600">
                                    You are entitled to add only two vendors at the moment.
                                </p>
                                <div className="mt-4">
                                    <VendorForm onClose={() => onClose(false)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex px-4 py-3 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="inline-flex justify-end rounded-md bg-gray-200 px-3 py-2 text-sm text-black shadow-sm hover:bg-gray-300 sm:ml-3 sm:w-auto"
                        >
                            Add Later
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}

export default NotificationModal
