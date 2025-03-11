"use client";

import { useState, useEffect, use } from "react";
import axios from "axios";
import withAuth from "@/lib/withAuth";
import EntriesForm from "@/components/EntriesForm";

const EditEntry = ({ params }) => {
    const { batchNo } = use(params);
    console.log("Batch No: " + batchNo);

    const [entry, setEntry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Entry Data", entry);
    }, [entry]);

    useEffect(() => {
        const fetchEntry = async () => {
            console.log(`Entry fetching data ${batchNo}`);
            try {
                const response = await axios.get(
                    `/api/entry/${batchNo}`
                );
                const data = response.data;
                setEntry(data[0]);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch Entry data");
                setLoading(false);
            }
        };

        fetchEntry();
    }, []);

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error)
        return <div className="text-center mt-8 text-[#E31E24]">{error}</div>;

    return (
        <div className="min-h-screen flex items-center justify-center">
            <EntriesForm isEdit={true} entry={entry} />
        </div>
    );
};

export default withAuth(EditEntry);
