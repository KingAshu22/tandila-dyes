import React from "react";
import { Phone, MapPin, Globe } from "lucide-react";

const EntriesTable = ({ entry }) => {
    if (!entry) {
        return <div className="text-center text-gray-500">No entry found</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
            {/* Letterhead */}
            <div className="border-b pb-4 mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Goregaon Dyeing</h1>
                <div className="flex justify-center gap-6 text-gray-600 text-sm mt-2 flex-wrap">
                    <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-blue-500" />
                        <span>+91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-500" />
                        <span>Goregaon West, Mumbai 400 065</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-red-500" />
                        <a href="https://goregaondyeing.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                            www.goregaondyeing.com
                        </a>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Batch Entry Details</h2>

            <div className="border rounded-lg overflow-hidden">
                {/* Table with 2 columns per row */}
                <table className="w-full border-collapse">
                    <tbody>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-2 text-left font-medium text-gray-600">Batch No:</th>
                            <td className="p-2">{entry.batchNo}</td>
                            <th className="p-2 text-left font-medium text-gray-600">Date:</th>
                            <td className="p-2">{new Date(entry.date).toLocaleDateString("en-IN")}</td>
                        </tr>
                        <tr className="border-b">
                            <th className="p-2 text-left font-medium text-gray-600">Client Code:</th>
                            <td className="p-2">{entry.clientCode}</td>
                            <th className="p-2 text-left font-medium text-gray-600">VR No:</th>
                            <td className="p-2">{entry.vrNo}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Work Orders Table */}
            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Work Orders</h3>
            <div className="overflow-x-auto">
                <table className="w-full border rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 text-left">Order No</th>
                            <th className="p-2 text-left">In Date</th>
                            <th className="p-2 text-left">Staff Code</th>
                            <th className="p-2 text-left">Description</th>
                            <th className="p-2 text-left">Quantity</th>
                            <th className="p-2 text-left">Unit</th>
                            <th className="p-2 text-left">Rate</th>
                            <th className="p-2 text-left">Amount</th>
                            <th className="p-2 text-left">Out Date</th>
                            <th className="p-2 text-left">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entry.workOrder.map((order, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100">
                                <td className="p-2">{order.orderNo}</td>
                                <td className="p-2">
                                    {new Date(new Date(order.inDate).getTime() - 5.5 * 60 * 60 * 1000).toLocaleString("en-IN", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}
                                </td>
                                <td className="p-2">{order.staffCode}</td>
                                <td className="p-2">{order.description}</td>
                                <td className="p-2">{order.quantity}</td>
                                <td className="p-2">{order.unit}</td>
                                <td className="p-2">{order.rate}</td>
                                <td className="p-2">{order.amount}</td>
                                <td className="p-2">
                                    {order.outDate ? new Date(order.outDate).toLocaleDateString("en-IN") : "-"}
                                </td>
                                <td className="p-2">{order.remarks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Print Button */}
            <div className="flex justify-end mt-4">
                <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                >
                    Print
                </button>
            </div>
        </div>
    );
};

export default EntriesTable;
