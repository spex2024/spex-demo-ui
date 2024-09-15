'use client'

import Image from "next/image";
import {useEffect, useState} from "react";
import {
    File,
    ListFilter,
    MoreHorizontal,
    PlusCircle,
    CircleArrowRight,
    CircleArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import MealDetail from "@/components/main/detail";
import useAuthStore from "@/app/store/authenticate";
import {useRouter} from "next/navigation";
import useVendorStore from "@/app/store/vendor";

type Meal = {
    _id: string;
    imageUrl: string;
    main: {
        name: string;
        price: number;
    };
    createdAt: string;
};

type OrderMeal = {
    mealId: string;
    quantity: number;
    price:number;
};

type Order = {
    meals: OrderMeal[];
    totalPrice: number;
};

type Vendor = {
    meals: Meal[];
    orders: Order[];
    imageUrl: string;
    name: string;
};

const ITEMS_PER_PAGE = 10;

export default function Dashboard() {
    const { vendor,fetchVendor} = useVendorStore()
    const meals: Meal[] = vendor?.meals || [];
    const orders: Order[] = vendor?.orders || [];
    const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                router.push('/login'); // Redirect to login page if not authenticated
            }
        }, 1000); // Adjust the delay as needed

        return () => clearTimeout(timer); // Clean up the timer if the component unmounts
    }, [isAuthenticated, router]);

    useEffect(() => {

        if (isAuthenticated) {
            fetchVendor()
        }

    }, [isAuthenticated, fetchVendor]);

    // Optionally, you can return a loading indicator while checking authentication
    if (!isAuthenticated) {
        return null
    }

    const totalPages = Math.ceil(meals.length / ITEMS_PER_PAGE);

    const currentMeals = meals.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const calculateTotalOrders = (mealId: string): number => {
        const filteredMeals = orders
            .flatMap(order => order.meals)
            .filter(meal => meal.mealId === mealId);
        return filteredMeals.length;
    };

    const calculateTotalSales = (mealId: string): number => {
        const filteredMeals = orders
            .flatMap(order => order.meals)
            .filter(meal => meal.mealId === mealId);

        const prices = filteredMeals.map(meal => meal.price);
        const total = prices.reduce((acc, price) => acc + price, 0);
        return total;
    };

    const formatDate = (isoString: string): string => {
        const date = new Date(isoString);
        return date.toLocaleString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };



    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <Tabs defaultValue="all">
                        <div className="flex items-center">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="active">Active</TabsTrigger>
                                <TabsTrigger value="draft">Inactive</TabsTrigger>
                            </TabsList>
                            <div className="ml-auto flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-7 gap-1">
                                            <ListFilter className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                Filter
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuCheckboxItem >
                                            Active
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>Inactive</DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button size="sm" variant="outline" className="h-7 gap-1">
                                    <File className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Export
                                    </span>
                                </Button>

                            </div>
                        </div>
                        <TabsContent value="all">
                            <Card x-chunk="dashboard-06-chunk-0">
                                <CardHeader>
                                    <CardTitle>Meals</CardTitle>
                                    <CardDescription>
                                        Manage your products and view their sales performance.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden w-[100px] sm:table-cell">
                                                    <span className="sr-only">Image</span>
                                                </TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Total Sales
                                                </TableHead>
                                                <TableHead className="">
                                                    Total Orders
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Created at
                                                </TableHead>
                                                <TableHead>
                                                    <span className="">Actions</span>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentMeals.length > 0 ? (
                                                currentMeals.map((meal) => (
                                                    <TableRow key={meal._id} onClick={() => setSelectedMeal(meal)}>
                                                        <TableCell className="hidden sm:table-cell">
                                                            <Image
                                                                alt="Product image"
                                                                className="aspect-square rounded-md object-cover"
                                                                height="64"
                                                                src={meal.imageUrl}
                                                                width="64"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {meal.main.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">Active</Badge>
                                                        </TableCell>
                                                        <TableCell>GH₵{meal.main.price.toFixed(2)}</TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            GH₵{calculateTotalSales(meal._id).toFixed(2)}
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            {calculateTotalOrders(meal._id)}
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            {formatDate(meal.createdAt)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center">
                                                        No meals found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="text-xs text-muted-foreground">
                                            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                                        </div>
                                        <div className="flex gap-2">

                                        <Button
                                            variant={`ghost`}
                                            className={`flex gap-2`}
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(prev => prev - 1)}
                                        >
                                            <CircleArrowLeft className="h-4 w-4"/> Previous
                                        </Button>

                                        <Button
                                            variant={`ghost`}
                                            className={`flex gap-2`}
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                        >
                                            Next <CircleArrowRight className="h-4 w-4"/>
                                        </Button>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
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
    );
}
