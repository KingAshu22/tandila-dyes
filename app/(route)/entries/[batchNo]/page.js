"use client";

import { useState, useEffect, use } from "react";
import axios from "axios";
import EntriesTable from "@/components/EntriesTable";

export default function BatchEntryView({ params }) {
    const { batchNo } = use(params);
    console.log("BatchNo: " + batchNo);

    const [entry, setEntry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEntry = async () => {
            console.log(`Entry fetching data ${batchNo}`);
            setLoading(true);
            try {
                const response = await axios.get(`/api/entry/${batchNo}`);
                setEntry(response.data[0]);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch Entry data");
                setLoading(false);
            }
        };

        if (batchNo) {
            fetchEntry();
        }
    }, [batchNo]);

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error)
        return <div className="text-center mt-8 text-[#E31E24]">{error}</div>;

    const handlePrint = () => {
        window.print();
    };

    return (
        <EntriesTable entry={entry} />
    );
}