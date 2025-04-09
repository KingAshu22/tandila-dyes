"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import numberToWords from "number-to-words";
import { Globe, Phone } from "lucide-react";
import Image from "next/image";

export default function BatchEntryView({ params }) {
    const { batchNo } = params;
    const [entry, setEntry] = useState(null);
    const [client, setClient] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEntry = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/entry/${batchNo}`);
                setEntry(response.data[0]);
                fetchClient(response.data[0].clientCode)
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch Entry data");
                setLoading(false);
            }
        };
        if (batchNo) fetchEntry();
    }, [batchNo]);

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
    if (!entry) return <div className="text-center text-gray-500">No entry found</div>;

    const totalQuantity = entry.workOrder.reduce((sum, order) => sum + order.quantity, 0);
    const totalAmount = entry.workOrder.reduce((sum, order) => sum + Number(order.amount), 0);
    const formattedTotalAmount = totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const amountInWords = numberToWords.toWords(totalAmount).replace(/\b\w/g, char => char.toUpperCase());

    return (
        <div>
            <style>
                {`
  @media print {
  #printable {
    border: 1px solid grey;
    border-radius: 16px;
  }
    body * {
      visibility: hidden;
    }

    #printable, #printable * {
      visibility: visible;
    }

    #printable {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      font-size: 10px;
    }

    #table {
      height: 334px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      border: hidden;
      border-radius: 5px;
      box-shadow: 0 0 0 1px grey;
    }

    th, td {
      border: 1px solid grey;
      padding: 2px;
    }
    
    thead tr:first-child th:first-child {
     border-top-left-radius: 10px;
    }

    thead tr:first-child th:last-child {
     border-top-right-radius: 10px;
    }

    tbody tr:last-child td:first-child {
     border-bottom-left-radius: 10px;
    }

    tbody tr:last-child td:last-child {
     border-bottom-right-radius: 10px;
    }
  }
`}
            </style>
            <div id="printable" className="p-2">
                <div className="flex justify-center mb-2 -mt-4">
                    <Image
                        src="/logo.png"
                        width={48}
                        height={8}
                        alt="Logo"
                    />
                </div>
                <h1 className="text-sm font-bold text-center -mt-6">Goregaon Dyeing</h1>
                <h2 className="text-[8px] text-center whitespace-nowrap">237/1890, Motilal Nagar No 1, Road No 4, Near Ganesh Mandir, Goregaon West, Mumbai 400 104</h2>
                <div className="flex flex-row justify-center gap-2 md:gap-6 text-sm text-[8px] border-b border-dashed border-black">
                    <div className="flex items-center justify-center gap-1">
                        <Phone className="w-2 h-2 text-primary" />
                        <span>+91 91361 99100 / +91 92247 26007</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                        <Globe className="w-2 h-2 text-primary" />
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
                <h2 className="text-xs text-center">Batch Entry Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Batch No:</th><td>{entry.batchNo}</td>
                            <th>Date:</th><td>{new Date(entry.date).toLocaleDateString("en-GB")}</td>
                        </tr>
                        <tr>
                            <th>Client:</th><td>{entry.clientCode} - {client?.name}</td>
                            <th>Challan No:</th><td>{entry.vrNo}</td>
                        </tr>
                    </tbody>
                </table>
                <h3 className="text-xs mt-2 text-center">Work Orders</h3>
                <div id="table">
                    <table className="text-[8px]">
                        <thead>
                            <tr>
                                <th className="text-[7px] w-16">Order No</th>
                                <th className="text-[7px] w-[200px]">Description</th>
                                <th className="w-10">Qty</th>
                                <th className="w-4">Rate</th>
                                <th className="w-4">Amount</th>
                            </tr>
                            <tr></tr>
                        </thead>
                        <tbody>
                            {entry.workOrder.map((order, index) => (
                                <tr key={index}>
                                    <td className="text-[5px]">{order.orderNo}</td>
                                    <td className="text-[8px]">{order.description}</td>
                                    <td className="text-[8px] whitespace-nowrap">{order.quantity} {order.unit}</td>
                                    <td>{order.rate}</td>
                                    <td>{order.amount.toLocaleString("en-IN")}</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={5}></td>
                            </tr>
                            <tr>
                                <td className="text-left font-bold">Total:</td>
                                <td className="text-[8px]">{amountInWords} Rupees Only</td>
                                <td className="text-[8px]">{totalQuantity} mtr</td>
                                <td></td>
                                <td>₹{formattedTotalAmount}/-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* Make a section for authorized signatory */}
                <div className="flex flex-col justify-end gap-1 text-[8px] text-right text-muted-foreground mt-4">
                    <span className="mt-4">____________________</span>
                    <span>Authorised Signatory</span>
                </div>
            </div>
            <button onClick={() => window.print()} className="mt-2 bg-blue-500 text-white p-1 rounded">Print</button>
        </div>
    );
}
