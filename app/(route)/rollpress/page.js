"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "./data-table";
import { HashLoader } from "react-spinners";
import withAuth from "@/lib/withAuth";
import { columns } from "./columns";

function RollPressTable() {
    const [rollpress, setRollPress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRollPress();
    }, []);

    const fetchRollPress = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get("/api/rollpress");

            console.log(response.data);
            setRollPress(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching rollpress:", error);
            setError("Failed to fetch rollpress. Please try again later.");
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex justify-center items-center p-10">
                    <HashLoader color="#dc2626" size={80} />
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="container mx-auto py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container w-full px-4">
            <DataTable columns={columns} data={rollpress} />
        </div>
    );
}

export default withAuth(RollPressTable);
