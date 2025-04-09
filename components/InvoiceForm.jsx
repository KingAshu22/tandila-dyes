"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SingleSearch from "./SingleSearch"

const formSchema = z.object({
    date: z.string(),
    clientCode: z.string(),
    invoiceNo: z.string(),
    fromDate: z.string(),
    toDate: z.string(),
    paymentReceived: z
        .array(
            z.object({
                date: z.string(),
                amount: z.number().positive(),
                mode: z.string(),
                receivedTo: z.string(),
            }),
        )
        .default([]),
    balanceAmount: z.string(),
})

export default function InvoiceForm({ isEdit = false, invoice }) {
    const [clientName, setClientName] = useState("")
    const [clients, setClients] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: invoice?.date ? new Date(invoice.date).toISOString().split("T")[0] : "",
            clientCode: invoice?.clientCode || "",
            invoiceNo: invoice?.invoiceNo || "",
            fromDate: invoice?.fromDate ? new Date(invoice.fromDate).toISOString().split("T")[0] : "",
            toDate: invoice?.toDate ? new Date(invoice.toDate).toISOString().split("T")[0] : "",
            paymentReceived: Array.isArray(invoice?.paymentReceived) ? invoice.paymentReceived : [],
            balanceAmount: invoice?.balanceAmount || "",
        },
    })

    useEffect(() => {
        fetchClients()
    }, [])

    useEffect(() => {
        if (clientName) {
            const client = clients.find((c) => c.name === clientName)
            form.setValue("clientCode", client?.code || "") // Ensure clientCode is updated
        }
    }, [clientName, clients])

    const fetchClients = async () => {
        try {
            const response = await axios.get("/api/clients")
            setClients(response.data)
        } catch (error) {
            console.error("Error fetching clients:", error)
        }
    }

    const getCode = async () => {
        try {
            const response = await axios.get("/api/get-last-invoice")
            const lastCode = response.data.code
            const newCode = (Number.parseInt(lastCode, 10) + 1).toString().padStart(4, "0")
            form.setValue("invoiceNo", newCode)
        } catch (error) {
            console.error("Error fetching code:", error)
        }
    }

    useEffect(() => {
        if (!isEdit) {
            getCode()
        }
    }, [isEdit])

    async function onSubmit(values) {
        try {
            setIsLoading(true)
            const response = await axios.post("/api/invoice", values)
            if (response.status === 200) {
                alert("Invoice saved successfully!")
                form.reset()
            } else {
                alert("Failed to save the invoice.")
            }
        } catch (error) {
            console.error("Error saving invoice:", error)
            alert("An error occurred while saving the invoice.")
        } finally {
            setIsLoading(false)
        }
    }

    async function editSubmit(values) {
        try {
            setIsLoading(true)
            const response = await axios.put(`/api/invoice/${values.invoiceNo}`, values)
            if (response.status === 200) {
                alert("Invoice edited successfully!")
            } else {
                alert("Failed to edit the invoice.")
            }
        } catch (error) {
            console.error("Error editing invoice:", error)
            alert("An error occurred while editing the invoice.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const calculateBalanceAmount = async () => {
            const clientCode = form.getValues("clientCode")
            const fromDate = form.getValues("fromDate")
            const toDate = form.getValues("toDate")

            if (clientCode && fromDate && toDate) {
                try {
                    const response = await axios.get(
                        `/api/entry/date-range?clientCode=${clientCode}&fromDate=${fromDate}&toDate=${toDate}`,
                    )
                    const { totalAmount } = response.data

                    // Set the balance amount as a string
                    form.setValue("balanceAmount", totalAmount.toString())
                } catch (error) {
                    console.error("Error calculating balance amount:", error)
                }
            }
        }

        calculateBalanceAmount()
    }, [form.watch("clientCode"), form.watch("fromDate"), form.watch("toDate")])

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center text-[#232C65]">
                    {isEdit ? "Edit Invoice" : "Create Invoice"}
                </CardTitle>
                <CardDescription className="text-center">{isEdit ? "Edit Invoice" : "Create a new Invoice"}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(isEdit ? editSubmit : onSubmit)} className="space-y-4" autoComplete="off">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" placeholder="Enter date" autoComplete="off" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-2">
                            <SingleSearch
                                type="Client Name"
                                list={clients.map((client) => client.name)}
                                selectedItem={clientName}
                                setSelectedItem={setClientName}
                                showSearch={true}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="clientCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Client Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Client Code" autoComplete="off" {...field} disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="invoiceNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Invoice No</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Invoice No" autoComplete="off" {...field} disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fromDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>From Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" placeholder="From Date" autoComplete="off" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="toDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>To Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" placeholder="To Date" autoComplete="off" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="balanceAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bill Amount</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Balance Amount" autoComplete="off" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-base">Payment Received</FormLabel>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const currentPayments = form.getValues("paymentReceived") || []
                                        form.setValue("paymentReceived", [
                                            ...currentPayments,
                                            { date: new Date().toISOString().split("T")[0], amount: 0, mode: "Cash", receivedTo: "" },
                                        ])
                                    }}
                                >
                                    Add Payment
                                </Button>
                            </div>

                            {(form.watch("paymentReceived") || []).map((_, index) => (
                                <div key={index} className="p-4 border rounded-md space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-medium">Payment #{index + 1}</h4>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                const currentPayments = form.getValues("paymentReceived") || []
                                                form.setValue(
                                                    "paymentReceived",
                                                    currentPayments.filter((_, i) => i !== index),
                                                )
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField
                                            control={form.control}
                                            name={`paymentReceived.${index}.date`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Date</FormLabel>
                                                    <FormControl>
                                                        <Input type="date" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`paymentReceived.${index}.amount`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Amount</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`paymentReceived.${index}.mode`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Mode</FormLabel>
                                                    <FormControl>
                                                        <select className="w-full p-2 border rounded-md" {...field}>
                                                            <option value="Cash">Cash</option>
                                                            <option value="Cheque">Cheque</option>
                                                            <option value="UPI">UPI</option>
                                                            <option value="Bank Transfer">Bank Transfer</option>
                                                        </select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`paymentReceived.${index}.receivedTo`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Received To</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button type="submit" className="w-full bg-[#E31E24] hover:bg-[#C71D23] text-white" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isEdit ? "Updating..." : "Registering..."}
                                </>
                            ) : isEdit ? (
                                "Update Invoice"
                            ) : (
                                "Create Invoice"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
