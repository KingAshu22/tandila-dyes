"use client"

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, FileText, ReceiptIndianRupee } from "lucide-react"
import withAuth from "@/lib/withAuth"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

function ClientBalanceSheet() {
    const { code } = useParams()
    const [entries, setEntries] = useState([])
    const [invoices, setInvoices] = useState([])
    const [clientName, setClientName] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const [entriesRes, invoicesRes] = await Promise.all([
                    fetch(`/api/entry/client/${code}`),
                    fetch(`/api/invoice/client/${code}`)
                ])
                const [entriesData, invoicesData] = await Promise.all([
                    entriesRes.json(),
                    invoicesRes.json()
                ])
                setEntries(entriesData)
                setInvoices(invoicesData)
                setClientName(`Client ${code}`)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        if (code) {
            fetchData()
        }
    }, [code])

    if (loading) {
        return <p className="text-center py-10">Loading...</p>
    }

    const debitItems = entries.flatMap((entry) => {
        const totalAmount = entry.workOrder.reduce((sum, order) => sum + order.amount, 0)
        return {
            date: new Date(entry.date),
            description: `Batch #${entry.batchNo}`,
            reference: `VR #${entry.vrNo}`,
            debit: totalAmount,
            credit: 0,
            balance: 0,
            type: "entry",
        }
    })

    const creditItems = invoices.flatMap((invoice) =>
        invoice.paymentReceived.map((payment) => ({
            date: new Date(payment.date),
            description: `Payment Received (${payment.mode})`,
            reference: `Invoice #${invoice.invoiceNo}`,
            debit: 0,
            credit: payment.amount,
            balance: 0,
            type: "payment",
        }))
    )

    const allItems = [...debitItems, ...creditItems].sort((a, b) => a.date - b.date)

    let runningBalance = 0
    const balanceSheetItems = allItems.map((item) => {
        runningBalance = runningBalance + item.debit - item.credit
        return {
            ...item,
            balance: runningBalance,
        }
    })

    const totalDebit = balanceSheetItems.reduce((sum, item) => sum + item.debit, 0)
    const totalCredit = balanceSheetItems.reduce((sum, item) => sum + item.credit, 0)
    const finalBalance = totalDebit - totalCredit

    return (
        <div className="container mx-auto py-8 px-4">
            <Card className="shadow-lg">
                <CardHeader className="bg-gray-50 border-b">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold">Balance Sheet</CardTitle>
                            <p className="text-gray-500 mt-1">
                                {clientName} (Code: {code})
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <CalendarIcon className="h-4 w-4" />
                            <span>Generated on {format(new Date(), "MMMM d, yyyy")}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-100">
                                    <TableHead className="w-[120px]">Date</TableHead>
                                    <TableHead className="w-[300px]">Description</TableHead>
                                    <TableHead className="w-[150px]">Reference</TableHead>
                                    <TableHead className="text-right">Debit (₹)</TableHead>
                                    <TableHead className="text-right">Credit (₹)</TableHead>
                                    <TableHead className="text-right">Balance (₹)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {balanceSheetItems.map((item, index) => (
                                    <TableRow key={index} className={item.type === "payment" ? "bg-gray-50" : ""}>
                                        <TableCell className="font-medium">{format(item.date, "dd/MM/yyyy")}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {item.type === "entry" ? (
                                                    <FileText className="h-4 w-4 text-gray-500" />
                                                ) : (
                                                    <ReceiptIndianRupee className="h-4 w-4 text-green-500" />
                                                )}
                                                <span>{item.description}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.reference}</TableCell>
                                        <TableCell className="text-right">{item.debit > 0 ? item.debit.toLocaleString("en-IN") : "-"}</TableCell>
                                        <TableCell className="text-right">{item.credit > 0 ? item.credit.toLocaleString("en-IN") : "-"}</TableCell>
                                        <TableCell className={`text-right font-medium ${item.balance < 0 ? "text-red-600" : ""}`}>
                                            {item.balance.toLocaleString("en-IN")}
                                        </TableCell>
                                    </TableRow>
                                ))}

                                <TableRow className="bg-gray-100 font-bold border-t-2">
                                    <TableCell colSpan={3} className="text-right">
                                        Total
                                    </TableCell>
                                    <TableCell className="text-right">{totalDebit.toLocaleString("en-IN")}</TableCell>
                                    <TableCell className="text-right">{totalCredit.toLocaleString("en-IN")}</TableCell>
                                    <TableCell className={`text-right ${finalBalance < 0 ? "text-red-600" : ""}`}>
                                        {finalBalance.toLocaleString("en-IN")}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Debits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">₹{totalDebit.toLocaleString("en-IN")}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">₹{totalCredit.toLocaleString("en-IN")}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={`text-2xl font-bold ${finalBalance < 0 ? "text-red-600" : "text-green-600"}`}>
                            ₹{finalBalance.toLocaleString("en-IN")}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default (ClientBalanceSheet)
