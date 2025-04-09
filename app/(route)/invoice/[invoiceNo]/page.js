"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import numberToWords from "number-to-words";
import { Globe, Phone } from "lucide-react";
import Image from "next/image";
import InvoicePrint from "@/components/InvoicePrint";
import { useParams } from "next/navigation";

export default function InvoiceView({ params }) {
    const { invoiceNo } = useParams()
    const [invoice, setInvoice] = useState(null);
    const [client, setClient] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/invoice/${invoiceNo}`);
                setInvoice(response.data[0]);
                fetchClient(response.data[0].clientCode)
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch Invoice data");
                setLoading(false);
            }
        };
        if (invoiceNo) fetchInvoice();
    }, [invoiceNo]);

    const fetchClient = async (code) => {
        try {
            const response = await
                axios.get(`/api/clients/${code}`)
            setClient(response.data[0])
            setLoading(false)
        } catch (err) {
            setError("Failed to fetch client")
            setLoading(false)
        }
    }

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
    if (!invoice) return <div className="text-center text-gray-500">No invoice found</div>;

    return (
        <InvoicePrint invoice={invoice} clientName={client?.name} />
    );
}
