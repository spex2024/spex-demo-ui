// components/Modal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EyeIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip as ChartTooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    ChartTooltip,
    Legend
);

interface VendorMetricsModalProps {
    vendorName: string;
    metrics: {
        daily: number;
        weekly: number;
        monthly: number;
        yearly: number;
    };
}

// Helper function to calculate percentage growth between two metrics
const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 'N/A';  // Avoid division by zero
    const growth = ((current - previous) / previous) * 100;
    return `${growth.toFixed(2)}%`;
};

// Chart data generation function
const generateChartData = (data: number[]) => {
    return {
        labels: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
        datasets: [
            {
                label: 'Spend (GH₵)',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 8,
                borderWidth: 2,
            }
        ],
    };
};

export function VendorMetricsModal({ vendorName, metrics }: VendorMetricsModalProps) {
    const chartData = generateChartData([metrics.daily, metrics.weekly, metrics.monthly, metrics.yearly]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className={`text-xs h-8 w-8 p-0`}>
                    <TooltipProvider>
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <Tooltip>
                                <TooltipTrigger>
                                    <EyeIcon size={16} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className={`text-xs`}>View Metrics</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </TooltipProvider>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-6 h-[70vh] overflow-y-auto"> {/* Scrollable content and reduced width */}
                <DialogHeader>
                    <DialogTitle>{vendorName} - Metrics</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4"> {/* Reduced card gap */}
                    {/* Daily Metric Card with Chart */}
                    <Card className="text-sm p-2"> {/* Reduced padding and text size */}
                        <CardHeader>
                            <CardTitle>Daily Spend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>GH₵ {metrics.daily}</p>
                            <p>Growth from Weekly: {calculateGrowth(metrics.daily, metrics.weekly / 7)}</p>
                            <Line data={generateChartData([metrics.daily])} options={{
                                responsive: true,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: {
                                            color: 'rgba(0, 0, 0, 0.1)',
                                        },
                                    },
                                    x: {
                                        grid: {
                                            display: false,
                                        },
                                    },
                                },
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => {
                                                return `GH₵ ${context.parsed.y}`;
                                            }
                                        }
                                    },
                                },
                            }} />
                        </CardContent>
                    </Card>

                    {/* Weekly Metric Card with Chart */}
                    <Card className="text-sm p-2">
                        <CardHeader>
                            <CardTitle>Weekly Spend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>GH₵ {metrics.weekly}</p>
                            <p>Growth from Monthly: {calculateGrowth(metrics.weekly, metrics.monthly / 4)}</p>
                            <Line data={generateChartData([metrics.weekly])} options={{
                                responsive: true,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: {
                                            color: 'rgba(0, 0, 0, 0.1)',
                                        },
                                    },
                                    x: {
                                        grid: {
                                            display: false,
                                        },
                                    },
                                },
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => {
                                                return `GH₵ ${context.parsed.y}`;
                                            }
                                        }
                                    },
                                },
                            }} />
                        </CardContent>
                    </Card>

                    {/* Monthly Metric Card with Chart */}
                    <Card className="text-sm p-2">
                        <CardHeader>
                            <CardTitle>Monthly Spend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>GH₵ {metrics.monthly}</p>
                            <p>Growth from Yearly: {calculateGrowth(metrics.monthly, metrics.yearly / 12)}</p>
                            <Line data={generateChartData([metrics.monthly])} options={{
                                responsive: true,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: {
                                            color: 'rgba(0, 0, 0, 0.1)',
                                        },
                                    },
                                    x: {
                                        grid: {
                                            display: false,
                                        },
                                    },
                                },
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => {
                                                return `GH₵ ${context.parsed.y}`;
                                            }
                                        }
                                    },
                                },
                            }} />
                        </CardContent>
                    </Card>

                    {/* Yearly Metric Card with Chart */}
                    <Card className="text-sm p-2">
                        <CardHeader>
                            <CardTitle>Yearly Spend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>GH₵ {metrics.yearly}</p>
                            <p>Growth from Previous Year: N/A</p>
                            <Line data={generateChartData([metrics.yearly])} options={{
                                responsive: true,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: {
                                            color: 'rgba(0, 0, 0, 0.1)',
                                        },
                                    },
                                    x: {
                                        grid: {
                                            display: false,
                                        },
                                    },
                                },
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => {
                                                return `GH₵ ${context.parsed.y}`;
                                            }
                                        }
                                    },
                                },
                            }} />
                        </CardContent>
                    </Card>
                </div>

                {/* Overall Chart displaying Daily, Weekly, Monthly, Yearly trends */}
                <div className=" mx-auto w-[90%] mt-4">
                    <h3 className="text-base font-semibold">Overall Spend Trends</h3>
                    <Line data={chartData} options={{
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(0, 0, 0, 0.1)',
                                },
                            },
                            x: {
                                grid: {
                                    display: false,
                                },
                            },
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        return `GH₵ ${context.parsed.y}`;
                                    }
                                }
                            },
                        },
                    }} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
