"use client";

import { useState, useEffect, use } from "react";
import axios from "axios";
import withAuth from "@/lib/withAuth";
import InvoiceForm from "@/components/InvoiceForm";

const EditInvoice = ({ params }) => {
    const { invoiceNo } = use(params);
    console.log("invoiceNo: " + invoiceNo);

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Invoice Data", invoice);
    }, [invoice]);

    useEffect(() => {
        const fetchInvoice = async () => {
            console.log(`Invoice fetching data ${invoiceNo}`);
            try {
                const response = await axios.get(
                    `/api/invoice/${invoiceNo}`
                );
                const data = response.data;
                setInvoice(data[0]);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch Invoice data");
                setLoading(false);
            }
        };

        fetchInvoice();
    }, []);

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error)
        return <div className="text-center mt-8 text-[#E31E24]">{error}</div>;

    return (
        <div className="min-h-screen flex items-center justify-center">
            <InvoiceForm isEdit={true} invoice={invoice} />
        </div>
    );
};

export default withAuth(EditInvoice);
