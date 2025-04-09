"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { HashLoader } from "react-spinners";
import withAuth from "@/lib/withAuth";

function InvoiceTable() {
  const [invoice, setInvoice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/invoice");
      console.log(response.data);
      setInvoice(response.data);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      setError("Failed to fetch invoice. Please try again later.");
    } finally {
      setLoading(false);
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
      <DataTable columns={columns} data={invoice} />
    </div>
  );
}

export default withAuth(InvoiceTable);
