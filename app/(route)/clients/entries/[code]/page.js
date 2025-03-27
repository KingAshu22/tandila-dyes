"use client"

import { useState, useEffect, use } from "react"
import axios from "axios"
import withAuth from "@/lib/withAuth"
import { Globe, MapPin, Phone, Printer } from "lucide-react"
import numberToWords from "number-to-words"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

const ClientEntries = ({ params }) => {
    const { code } = use(params)

    const [entries, setEntries] = useState([])
    const [client, setClient] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sortedWorkOrders, setSortedWorkOrders] = useState([])

    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [filteredWorkOrders, setFilteredWorkOrders] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [entriesRes, clientRes] = await Promise.all([
                    axios.get(`/api/entry/client/${code}`),
                    axios.get(`/api/clients/${code}`),
                ])
                setEntries(entriesRes.data)
                setClient(clientRes.data[0])
                setLoading(false)
            } catch (err) {
                setError("Failed to fetch data")
                setLoading(false)
            }
        }

        fetchData()
    }, [code])

    useEffect(() => {
        if (entries.length > 0) {
            // Create a flat array of all work orders with their parent batch number
            const allWorkOrders = entries.flatMap((entry) =>
                entry.workOrder.map((order) => ({
                    ...order,
                    batchNo: entry.batchNo,
                    vrNo: entry.vrNo,
                })),
            )

            // Sort the work orders by inDate in ascending order
            const sorted = [...allWorkOrders].sort((a, b) => new Date(a.inDate) - new Date(b.inDate))

            setSortedWorkOrders(sorted)
        }
    }, [entries])

    useEffect(() => {
        if (sortedWorkOrders.length > 0) {
            if (fromDate && toDate) {
                const filtered = sortedWorkOrders.filter((order) => {
                    const orderDate = new Date(order.inDate)
                    return orderDate >= fromDate && orderDate <= toDate
                })
                setFilteredWorkOrders(filtered)
            } else {
                setFilteredWorkOrders(sortedWorkOrders)
            }
        }
    }, [sortedWorkOrders, fromDate, toDate])

    const handlePrint = () => {
        window.print()
    }

    const formatDate = (dateString) => {
        if (!dateString) return "-"
        return new Date(new Date(dateString).getTime() - 5.5 * 60 * 60 * 1000).toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
    }

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>
    if (error) return <div className="flex justify-center items-center min-h-screen text-destructive">{error}</div>

    const totalAmount = filteredWorkOrders.reduce((sum, order) => sum + order.amount, 0)

    const amountInWords = numberToWords
        .toWords(totalAmount)
        .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
        .replace(/,/g, "") // Remove unwanted commas

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 print:p-0 print:bg-white">
            {/* Print Button - Hidden when printing */}
            <div className="print:hidden flex justify-end mb-4 gap-2 items-center flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="grid gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("w-[180px] justify-start text-left font-normal", !fromDate && "text-muted-foreground")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {fromDate ? format(fromDate, "PPP") : <span>From Date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("w-[180px] justify-start text-left font-normal", !toDate && "text-muted-foreground")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {toDate ? format(toDate, "PPP") : <span>To Date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <Button onClick={handlePrint} className="gap-2">
                    <Printer className="h-4 w-4" />
                    Print Invoice
                </Button>
            </div>

            <Card className="w-full max-w-[250mm] mx-auto shadow-md print:shadow-none print:max-w-none">
                <CardContent className="p-6 print:p-4">
                    {/* Header */}
                    <div className="border-b pb-4 mb-4 text-center -mt-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-primary">Goregaon Dyeing</h1>
                        <div className="items-center justify-center text-[14px]">
                            <span>237/1890, Motilal Nagar No 1, Road No 4, Near Ganesh Mandir, Goregaon West, Mumbai 400 104</span>
                        </div>
                        <div className="flex flex-row justify-center gap-2 md:gap-6 text-muted-foreground text-sm mt-2 text-[14px]">
                            <div className="flex items-center justify-center gap-2">
                                <Phone className="w-4 h-4 text-primary" />
                                <span>+91 91361 99100 / +91 92247 26007</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <Globe className="w-4 h-4 text-primary" />
                                <a
                                    href="https://goregaondyeing.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    www.goregaondyeing.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Client Information */}
                    {client && (
                        <div className="mb-6 w-full">
                            <h2 className="text-xl md:text-2xl font-semibold">{client.name}</h2>
                            <p className="text-muted-foreground">{client.address}</p>
                            <p className="text-muted-foreground">Contact: {client.contact}</p>
                        </div>
                    )}

                    {/* Table for larger screens */}
                    <div className="w-full overflow-x-auto hidden md:block print:block">
                        <table className="w-full border-collapse border-rounded">
                            <thead>
                                <tr className="bg-muted text-left text-[10px]">
                                    <th className="border px-1 text-center w-20">In Date</th>
                                    <th className="border px-1 text-center w-20">Batch No</th>
                                    <th className="border px-1 text-center w-20">Challan No</th>
                                    <th className="border px-1 text-center w-20">Out Date</th>
                                    <th className="border px-1 text-center w-32">Description</th>
                                    <th className="border px-1 text-center w-8">Service</th>
                                    <th className="border px-1 text-center w-8">Quantity</th>
                                    <th className="border px-1 text-center w-8">Rate</th>
                                    <th className="border px-1 text-center w-8">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredWorkOrders.map((order) => (
                                    <tr key={order._id} className="border hover:bg-muted/50 print:hover:bg-transparent text-[8px]">
                                        <td className="border p-0">{formatDate(order.inDate)}</td>
                                        <td className="border p-0 whitespace-nowrap">{order.batchNo}</td>
                                        <td className="border p-0 whitespace-nowrap">{order.vrNo}</td>
                                        <td className="border p-0">{formatDate(order.outDate)}</td>
                                        <td className="border p-0">{order.description}</td>
                                        <td className="border p-0">{order.service || "-"}</td>
                                        <td className="border p-0">
                                            {order.quantity} {order.unit}
                                        </td>
                                        <td className="border p-0 text-right">₹{order.rate}</td>
                                        <td className="border p-0 text-right">
                                            ₹{order.amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr className="bg-muted font-bold text-[10px]">
                                    <td className="border px-1">Total</td>
                                    <td className="border px-1 text-left" colSpan={7}>
                                        {amountInWords} Rupees Only
                                    </td>
                                    <td className="border px-1 text-right">
                                        ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile view - Cards instead of table */}
                    <div className="md:hidden print:hidden space-y-4">
                        {filteredWorkOrders.map((order) => (
                            <Card key={order._id} className="overflow-hidden">
                                <CardContent className="p-4 grid grid-cols-2 gap-2 text-xs">
                                    <div className="col-span-2 bg-muted -m-4 mb-2 p-2 flex justify-between">
                                        <span>Batch: {order.batchNo}</span>
                                        <span>Order: {order.orderNo}</span>
                                    </div>

                                    <div className="font-semibold">In Date:</div>
                                    <div>{formatDate(order.inDate)}</div>

                                    <div className="font-semibold">Out Date:</div>
                                    <div>{formatDate(order.outDate)}</div>

                                    <div className="font-semibold">Description:</div>
                                    <div>{order.description}</div>

                                    <div className="font-semibold">Service:</div>
                                    <div>{order.service || "-"}</div>

                                    <div className="font-semibold">Quantity:</div>
                                    <div>
                                        {order.quantity} {order.unit}
                                    </div>

                                    <div className="font-semibold">Rate:</div>
                                    <div>₹{order.rate}</div>

                                    <div className="font-semibold">Amount:</div>
                                    <div>
                                        ₹{order.amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <Card className="bg-muted">
                            <CardContent className="p-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="font-bold">Total Amount:</div>
                                    <div className="font-bold text-right">
                                        ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>

                                    <div className="col-span-2 text-sm">{amountInWords} Rupees Only</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default withAuth(ClientEntries)