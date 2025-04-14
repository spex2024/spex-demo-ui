"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import {
    File,
    ListFilter,
    ChevronLeft,
    ChevronRight,
    Edit2Icon,
    EyeIcon,
    Trash,
    Plus,
    DollarSignIcon,
    UtensilsIcon,
    ClockIcon,
    CalendarIcon,
    Droplet,
    Sandwich,
    ShoppingCartIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import useVendorStore from "@/app/store/vendor"
import useAuth from "@/app/hook/auth"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

type Meal = {
    _id: string
    imageUrl: string
    mealName: string
    price: number
    protein: string[]
    sauce: string[]
    extras: string[]
    createdAt: string
    description?: string
    daysAvailable: string[]
}

type Order = {
    meals: { mealId: string; quantity: number; price: number }[]
    totalPrice: number
}

const ITEMS_PER_PAGE = 10

export default function Dashboard() {
    const { vendor, fetchVendor } = useVendorStore()
    const meals: Meal[] = vendor?.meals || []
    const orders: Order[] = vendor?.orders || []
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")
    const [mealToDelete, setMealToDelete] = useState<string | null>(null)

    const { deleteMeal, success, error } = useAuth()

    useEffect(() => {
        fetchVendor()
    }, [fetchVendor])

    useEffect(() => {
        if (success) {
            toast({
                title: "Success",
                description: success,
                variant: "default",
            })
        } else if (error) {
            toast({
                title: "Error",
                description: error,
                variant: "destructive",
            })
        }
    }, [success, error])

    const filteredMeals = meals.filter(
        (meal) =>
            meal.mealName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterStatus === "all" ||
                (filterStatus === "active" && meal.price > 0) ||
                (filterStatus === "inactive" && meal.price === 0)),
    )

    const totalPages = Math.ceil(filteredMeals.length / ITEMS_PER_PAGE)
    const currentMeals = filteredMeals.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const calculateTotalOrders = (mealId: string): number => {
        return orders.flatMap((order) => order.meals).filter((meal) => meal?.mealId === mealId).length
    }

    const calculateTotalSales = (mealId: string): number => {
        return orders
            .flatMap((order) => order.meals)
            .filter((meal) => meal?.mealId === mealId)
            .reduce((acc, meal) => acc + meal.price, 0)
    }

    const formatDate = (isoString: string): string => {
        return new Date(isoString).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const editMeal = (id: string) => {
        console.log(`Editing meal with id: ${id}`)
        // Implement edit functionality
    }

    const deleteMealItem = async () => {
        if (mealToDelete) {
            await deleteMeal(mealToDelete)
            fetchVendor() // Refresh the vendor data after deletion
            setMealToDelete(null) // Reset the mealToDelete state
        }
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:container sm:max-w-9xl">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                        <UtensilsIcon className="mr-3 h-7 w-7 text-[#71bc44]" />
                        Meal Dashboard
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search meals..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-10 w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-[#71bc44] focus:outline-none focus:ring-1 focus:ring-[#71bc44] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-full border-[#71bc44]/30 text-[#71bc44] hover:bg-[#71bc44]/10 hover:border-[#71bc44]"
                                >
                                    <ListFilter className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                    checked={filterStatus === "all"}
                                    onCheckedChange={() => setFilterStatus("all")}
                                >
                                    All
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={filterStatus === "active"}
                                    onCheckedChange={() => setFilterStatus("active")}
                                >
                                    Active
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={filterStatus === "inactive"}
                                    onCheckedChange={() => setFilterStatus("inactive")}
                                >
                                    Inactive
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            size="icon"
                            variant="outline"
                            className="h-10 w-10 rounded-full border-[#71bc44]/30 text-[#71bc44] hover:bg-[#71bc44]/10 hover:border-[#71bc44]"
                        >
                            <File className="h-4 w-4" />
                        </Button>
                    </div>
                </header>
                <main className="grid flex-1 gap-6 sm:container sm:max-w-9xl">
                    <Card className="overflow-hidden rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                        <CardHeader className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex flex-row justify-between items-center">
                            <div>
                                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                                    <UtensilsIcon className="mr-2 h-5 w-5 text-[#71bc44]" />
                                    Meals
                                </CardTitle>
                                <CardDescription className="text-gray-500 dark:text-gray-400">
                                    Manage your products and view their sales performance.
                                </CardDescription>
                            </div>
                            <Link href={"/pages/add-meal"}>
                                <Button className="bg-[#71bc44] hover:bg-[#71bc44]/90 text-white shadow-md transition-all duration-200 hover:shadow-lg">
                                    <Plus className="mr-2 h-4 w-4" /> Add Meal
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                    <tr className="bg-gradient-to-r from-[#71bc44]/90 to-[#71bc44]/70">
                                        <th className="p-4 text-left font-medium text-white rounded-tl-lg">Meal</th>
                                        <th className="p-4 text-left font-medium text-white">Status</th>
                                        <th className="p-4 text-left font-medium text-white">Price</th>
                                        <th className="p-4 text-left font-medium text-white">Total Sales</th>
                                        <th className="p-4 text-left font-medium text-white">Total Orders</th>
                                        <th className="p-4 text-left font-medium text-white rounded-tr-lg">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {currentMeals?.map((meal, index) => (
                                        <tr
                                            key={meal._id}
                                            className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors`}
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative h-12 w-12 overflow-hidden rounded-md border border-[#71bc44]/20">
                                                        <Image
                                                            alt={meal.mealName}
                                                            className="object-cover"
                                                            fill
                                                            src={meal.imageUrl || "/placeholder.svg"}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800 dark:text-gray-200">{meal.mealName}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(meal.createdAt)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge
                                                    variant={meal.price > 0 ? "default" : "secondary"}
                                                    className={
                                                        meal.price > 0
                                                            ? "bg-[#71bc44] text-white font-medium px-3 py-1"
                                                            : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 font-medium px-3 py-1"
                                                    }
                                                >
                                                    {meal.price > 0 ? "Active" : "Inactive"}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center">
                                                    <span className="font-medium text-gray-800 dark:text-gray-200">
                              GH₵{meal.price.toFixed(2)}
                            </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center">
                                                    <span className="font-medium text-gray-800 dark:text-gray-200">
                              GH₵{calculateTotalSales(meal._id).toFixed(2)}
                            </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center">
                                                    <span className="font-medium text-gray-800 dark:text-gray-200">
                              {calculateTotalOrders(meal._id)}
                            </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex space-x-2">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    onClick={() => editMeal(meal._id)}
                                                                    className="h-9 w-9 rounded-full border-[#71bc44]/30 text-[#71bc44] hover:bg-[#71bc44]/10 hover:text-[#71bc44] hover:border-[#71bc44]"
                                                                >
                                                                    <Edit2Icon size={16} />
                                                                    <span className="sr-only">Edit</span>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Edit Meal</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-9 w-9 rounded-full border-[#71bc44]/30 text-[#71bc44] hover:bg-[#71bc44]/10 hover:text-[#71bc44] hover:border-[#71bc44]"
                                                                >
                                                                    <EyeIcon size={16} />
                                                                    <span className="sr-only">View Meal Details</span>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="right" align="start" className="w-[350px] p-0">
                                                                <Card className="border-t-4 border-t-[#71bc44] rounded-md shadow-lg">
                                                                    <CardHeader className="pb-2 bg-gradient-to-r from-[#71bc44]/90 to-[#71bc44]/70">
                                                                        <CardTitle className="text-xl font-bold text-white">{meal.mealName}</CardTitle>
                                                                        <div className="flex items-center text-sm text-white/90">
                                                                            <ClockIcon size={14} className="mr-1" />
                                                                            <span>Created: {formatDate(meal.createdAt)}</span>
                                                                        </div>
                                                                    </CardHeader>
                                                                    <CardContent className="pb-2 pt-4">
                                                                        <div className="grid gap-3">
                                                                            <div className="flex items-center">
                                                                                <DollarSignIcon size={16} className="mr-2 text-[#71bc44]" />
                                                                                <span className="font-medium mr-2">Price:</span>
                                                                                <Badge
                                                                                    variant="secondary"
                                                                                    className="bg-[#71bc44]/10 text-[#71bc44] font-medium"
                                                                                >
                                                                                    GH₵{meal.price.toFixed(2)}
                                                                                </Badge>
                                                                            </div>
                                                                            <div>
                                          <span className="font-medium flex items-center mb-1">
                                            <UtensilsIcon size={16} className="mr-2 text-[#71bc44]" />
                                            Description:
                                          </span>
                                                                                <p className="text-sm ml-6">
                                                                                    {meal.description || "No description available."}
                                                                                </p>
                                                                            </div>
                                                                            <div>
                                          <span className="font-medium flex items-center mb-1">
                                            <CalendarIcon size={16} className="mr-2 text-[#71bc44]" />
                                            Available on:
                                          </span>
                                                                                <div className="flex flex-wrap gap-1 ml-6">
                                                                                    {meal?.daysAvailable?.map((day) => (
                                                                                        <Badge
                                                                                            key={day}
                                                                                            variant="outline"
                                                                                            className="text-xs bg-[#71bc44]/10 text-[#71bc44] border-[#71bc44]/30"
                                                                                        >
                                                                                            {day}
                                                                                        </Badge>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                          <span className="font-medium flex items-center mb-1">
                                            <UtensilsIcon size={16} className="mr-2 text-[#71bc44]" />
                                            Protein options:
                                          </span>
                                                                                <div className="flex flex-wrap gap-1 ml-6">
                                                                                    {meal?.protein?.map((protein) => (
                                                                                        <Badge
                                                                                            key={protein}
                                                                                            variant="outline"
                                                                                            className="text-xs bg-[#71bc44]/10 text-[#71bc44] border-[#71bc44]/30"
                                                                                        >
                                                                                            {protein}
                                                                                        </Badge>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                          <span className="font-medium flex items-center mb-1">
                                            <Droplet size={16} className="mr-2 text-[#71bc44]" />
                                            Sauce options:
                                          </span>
                                                                                <div className="flex flex-wrap gap-1 ml-6">
                                                                                    {meal?.sauce?.map((sauce) => (
                                                                                        <Badge
                                                                                            key={sauce}
                                                                                            variant="outline"
                                                                                            className="text-xs bg-[#71bc44]/10 text-[#71bc44] border-[#71bc44]/30"
                                                                                        >
                                                                                            {sauce}
                                                                                        </Badge>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                          <span className="font-medium flex items-center mb-1">
                                            <Sandwich size={16} className="mr-2 text-[#71bc44]" />
                                            Extra options:
                                          </span>
                                                                                <div className="flex flex-wrap gap-1 ml-6">
                                                                                    {meal?.extras?.map((extra) => (
                                                                                        <Badge
                                                                                            key={extra}
                                                                                            variant="outline"
                                                                                            className="text-xs bg-[#71bc44]/10 text-[#71bc44] border-[#71bc44]/30"
                                                                                        >
                                                                                            {extra}
                                                                                        </Badge>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center">
                                                                                <ShoppingCartIcon size={16} className="mr-2 text-[#71bc44]" />
                                                                                <span className="font-medium mr-2">Total Orders:</span>
                                                                                <Badge className="bg-[#71bc44]/10 text-[#71bc44] font-medium">
                                                                                    {calculateTotalOrders(meal._id)}
                                                                                </Badge>
                                                                            </div>
                                                                            <div className="flex items-center">
                                                                                <DollarSignIcon size={16} className="mr-2 text-[#71bc44]" />
                                                                                <span className="font-medium mr-2">Total Sales:</span>
                                                                                <Badge
                                                                                    variant="secondary"
                                                                                    className="bg-[#71bc44]/10 text-[#71bc44] font-medium"
                                                                                >
                                                                                    GH₵{calculateTotalSales(meal._id).toFixed(2)}
                                                                                </Badge>
                                                                            </div>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="icon"
                                                                            onClick={() => setMealToDelete(meal._id)}
                                                                            className="h-9 w-9 rounded-full border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-400"
                                                                        >
                                                                            <Trash size={16} />
                                                                            <span className="sr-only">Delete</span>
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Are you sure you want to delete this meal?</DialogTitle>
                                                                            <DialogDescription>
                                                                                This action cannot be undone. This will permanently delete the meal and remove
                                                                                its data from our servers.
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <DialogFooter>
                                                                            <Button variant="outline" onClick={() => setMealToDelete(null)}>
                                                                                Cancel
                                                                            </Button>
                                                                            <Button variant="destructive" onClick={deleteMealItem}>
                                                                                Delete
                                                                            </Button>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Delete Meal</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center justify-between w-full">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing <span className="font-medium text-[#71bc44]">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>{" "}
                                    to{" "}
                                    <span className="font-medium text-[#71bc44]">
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredMeals.length)}
                  </span>{" "}
                                    of <span className="font-medium text-[#71bc44]">{filteredMeals.length}</span> meals
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((prev) => prev - 1)}
                                        className={`rounded-full border-[#71bc44]/30 ${currentPage === 1 ? "text-gray-400" : "text-[#71bc44] hover:bg-[#71bc44]/10 hover:border-[#71bc44]"}`}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-2" />
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage((prev) => prev + 1)}
                                        className={`rounded-full border-[#71bc44]/30 ${currentPage === totalPages ? "text-gray-400" : "text-[#71bc44] hover:bg-[#71bc44]/10 hover:border-[#71bc44]"}`}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </main>
            </div>
        </div>
    )
}
