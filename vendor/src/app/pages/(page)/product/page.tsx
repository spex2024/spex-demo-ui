'use client'

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
    Search,
    Plus,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import MealDetail from "@/components/main/detail"
import useVendorStore from "@/app/store/vendor"
import useAuth from "@/app/hook/auth"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link";

type Meal = {
    _id: string
    imageUrl: string
    main: {
        name: string
        price: number
    }
    createdAt: string
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
    const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

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

    const filteredMeals = meals.filter(meal =>
        meal.main.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === 'all' || (filterStatus === 'active' && meal.main.price > 0) || (filterStatus === 'inactive' && meal.main.price === 0))
    )

    const totalPages = Math.ceil(filteredMeals.length / ITEMS_PER_PAGE)
    const currentMeals = filteredMeals.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const calculateTotalOrders = (mealId: string): number => {
        return orders.flatMap(order => order.meals).filter(meal => meal.mealId === mealId).length
    }

    const calculateTotalSales = (mealId: string): number => {
        return orders
            .flatMap(order => order.meals)
            .filter(meal => meal.mealId === mealId)
            .reduce((acc, meal) => acc + meal.price, 0)
    }

    const formatDate = (isoString: string): string => {
        return new Date(isoString).toLocaleString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const editMeal = (id: string) => {
        console.log(`Editing meal with id: ${id}`)
        // Implement edit functionality
    }

    const deleteMealItem = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this meal?")) {
            await deleteMeal(id)
            fetchVendor() // Refresh the vendor data after deletion
        }
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:container sm:max-w-9xl">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Meal Dashboard</h1>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="h-10 w-10">
                                    <ListFilter className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                    checked={filterStatus === 'all'}
                                    onCheckedChange={() => setFilterStatus('all')}
                                >
                                    All
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={filterStatus === 'active'}
                                    onCheckedChange={() => setFilterStatus('active')}
                                >
                                    Active
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={filterStatus === 'inactive'}
                                    onCheckedChange={() => setFilterStatus('inactive')}
                                >
                                    Inactive
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button size="icon" variant="outline" className="h-10 w-10">
                            <File className="h-4 w-4" />
                        </Button>
                    </div>
                </header>
                <main className="grid flex-1 gap-6 sm:container sm:max-w-9xl">
                    <Card className="overflow-hidden">
                        <CardHeader className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex flex-row justify-between items-center">
                            <div>
                                <CardTitle>Meals</CardTitle>
                                <CardDescription>
                                    Manage your products and view their sales performance.
                                </CardDescription>
                            </div>
                            <Link href={'/pages/add-meal'}>

                            <Button className="bg-green-500 hover:bg-green-600 text-white">
                                <Plus className="mr-2 h-4 w-4" /> Add Meal
                            </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="p-3 text-left font-medium text-gray-600 dark:text-gray-200">Meal</th>
                                        <th className="p-3 text-left font-medium text-gray-600 dark:text-gray-200 hidden">Status</th>
                                        <th className="p-3 text-left font-medium text-gray-600 dark:text-gray-200">Price</th>
                                        <th className="p-3 text-left font-medium text-gray-600 dark:text-gray-200">Total Sales</th>
                                        <th className="p-3 text-left font-medium text-gray-600 dark:text-gray-200">Total Orders</th>
                                        <th className="p-3 text-left font-medium text-gray-600 dark:text-gray-200">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {currentMeals.map((meal, index) => (
                                        <tr key={meal._id} className={`border-b border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}`}>
                                            <td className="p-3">
                                                <div className="w-full flex items-center space-x-3">
                                                    <Image
                                                        alt="Product image"
                                                        className="rounded-md object-cover hidden sm:block"
                                                        height="48"
                                                        src={meal.imageUrl}
                                                        width="48"
                                                    />
                                                    <span className="font-medium text-gray-800 dark:text-gray-200 text-xs space-x-2">{meal.main.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <Badge
                                                    variant={meal.main.price > 0 ? "default" : "secondary"}
                                                    className={meal.main.price > 0 ? "bg-green-400 text-white" : "bg-gray-500 text-white shadow-none text-xs"}
                                                >
                                                    {meal.main.price > 0 ? "Active" : "Inactive"}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-gray-700 dark:text-gray-300">GH₵{meal.main.price.toFixed(2)}</td>
                                            <td className="p-3 text-gray-700 dark:text-gray-300">GH₵{calculateTotalSales(meal._id).toFixed(2)}</td>
                                            <td className="p-3 text-gray-700 dark:text-gray-300">{calculateTotalOrders(meal._id)}</td>
                                            <td className="p-3">
                                                <div className="flex space-x-2">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => editMeal(meal._id)}
                                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
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
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => setSelectedMeal(meal)}
                                                                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                                                                >
                                                                    <EyeIcon size={16} />
                                                                    <span className="sr-only">View Details</span>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>View Details</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => deleteMealItem(meal._id)}
                                                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                                                                >
                                                                    <Trash size={16} />
                                                                    <span className="sr-only">Delete</span>
                                                                </Button>
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
                                    Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to <strong>{Math.min(currentPage * ITEMS_PER_PAGE, filteredMeals.length)}</strong> of <strong>{filteredMeals.length}</strong> meals
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        className="text-gray-600 dark:text-gray-400"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-2" />
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        className="text-gray-600 dark:text-gray-400"
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
            {selectedMeal && (
                <MealDetail
                    mealDetail={selectedMeal}
                    setSelectedMeal={setSelectedMeal}
                    image={vendor?.imageUrl || ""}
                    name={vendor?.name || ''}
                />
            )}
        </div>
    )
}