"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { Loader2 } from "lucide-react"
import InvoicePrint from "./invoice-print"

export default function InvoiceView() {
    const { invoiceNo } = useParams()
    const [invoice, setInvoice] = useState(null)
    const [clientName, setClientName] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`/api/invoice/${invoiceNo}`)
                setInvoice(response.data)

                // Fetch client name
                if (response.data.clientCode) {
                    const clientResponse = await axios.get(`/api/clients/${response.data.clientCode}`)
                    setClientName(clientResponse.data.name)
                }
            } catch (err) {
                console.error("Error fetching invoice:", err)
                setError("Failed to load invoice. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        if (invoiceNo) {
            fetchInvoice()
        }
    }, [invoiceNo])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading invoice...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                <p>{error}</p>
            </div>
        )
    }

    if (!invoice) {
        return (
            <div className="text-center p-4">
                <p>Invoice not found.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6">
            <InvoicePrint invoice={invoice} clientName={clientName} />
        </div>
    )
}