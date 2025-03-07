import React from "react";

const EntriesTable = ({ entry }) => {
    if (!entry) {
        return <div className="text-center text-gray-500">No entry found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                Batch Entry Details
            </h2>
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                    <tbody>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-2 text-left font-medium text-gray-600">Batch No:</th>
                            <td className="p-2">{entry.batchNo}</td>
                        </tr>
                        <tr className="border-b">
                            <th className="p-2 text-left font-medium text-gray-600">Date:</th>
                            <td className="p-2">{new Date(entry.date).toLocaleDateString()}</td>
                        </tr>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-2 text-left font-medium text-gray-600">Client Code:</th>
                            <td className="p-2">{entry.clientCode}</td>
                        </tr>
                        <tr className="border-b">
                            <th className="p-2 text-left font-medium text-gray-600">VR No:</th>
                            <td className="p-2">{entry.vrNo}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Work Orders</h3>
            <div className="overflow-x-auto">
                <table className="w-full border rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 text-left">Order No</th>
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
                                <td className="p-2">{order.staffCode}</td>
                                <td className="p-2">{order.description}</td>
                                <td className="p-2">{order.quantity}</td>
                                <td className="p-2">{order.unit}</td>
                                <td className="p-2">{order.rate}</td>
                                <td className="p-2">{order.amount}</td>
                                <td className="p-2">
                                    {order.outDate ? new Date(order.outDate).toLocaleDateString() : "-"}
                                </td>
                                <td className="p-2">{order.remarks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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