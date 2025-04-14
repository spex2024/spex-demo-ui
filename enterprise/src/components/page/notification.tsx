import {useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Bell, DollarSign, Package, ShoppingCart} from "lucide-react";

function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative border-none bg-white/10 hover:bg-white/20">
                    <Bell className="h-5 w-5 text-[#71bc44]" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#71bc44] text-[10px] font-medium text-white">
            3
          </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="border-b border-[#71bc44]/20 px-4 py-3 bg-[#71bc44]/5">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-[#333] dark:text-[#e0e0e0]">Notifications</h4>
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-[#71bc44]">
                            Mark all as read
                        </Button>
                    </div>
                </div>
                <div className="max-h-[300px] overflow-auto">
                    <div className="grid gap-1 p-1">
                        {[
                            { title: "New order received", desc: "You have a new order from Acme Corp", time: "10 minutes ago" },
                            { title: "Order completed", desc: "Order #1234 has been marked as completed", time: "30 minutes ago" },
                            { title: "Payment received", desc: "Payment of GH₵120 has been processed", time: "2 hours ago" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 rounded-lg p-3 hover:bg-[#71bc44]/5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#71bc44]/10">
                                    {i === 0 ? (
                                        <ShoppingCart className="h-4 w-4 text-[#71bc44]" />
                                    ) : i === 1 ? (
                                        <Package className="h-4 w-4 text-[#71bc44]" />
                                    ) : (
                                        <DollarSign className="h-4 w-4 text-[#71bc44]" />
                                    )}
                                </div>
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium leading-none text-[#333] dark:text-[#e0e0e0]">{item.title}</p>
                                    <p className="text-xs text-[#666] dark:text-[#999]">{item.desc}</p>
                                    <p className="text-xs text-[#666] dark:text-[#999]">{item.time}</p>
                                </div>
                                <div className="ml-auto flex h-full items-center">
                                    <span className="flex h-2 w-2 rounded-full bg-[#71bc44]"></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border-t border-[#71bc44]/20 p-2">
                    <Button variant="ghost" size="sm" className="w-full justify-center text-[#71bc44]">
                        View all notifications
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}


export default NotificationBell