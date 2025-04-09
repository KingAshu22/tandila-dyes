"use client"

import { Phone, Globe, Printer, Calendar, User, FileText } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import numberToWords from "number-to-words";

export default function InvoicePrint({ invoice, clientName }) {
    const handlePrint = () => {
        window.print()
    }

    const formatDisplayDate = (dateString) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    // Calculate total payment received
    const totalPaymentReceived = Array.isArray(invoice?.paymentReceived)
        ? invoice.paymentReceived.reduce((total, payment) => total + (payment.amount || 0), 0)
        : 0

    // Calculate balance due
    const balanceDue = Number.parseFloat(invoice?.balanceAmount || 0) - totalPaymentReceived

    const balanceInWords = numberToWords.toWords(balanceDue).replace(/\b\w/g, char => char.toUpperCase());

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
            {/* Print Button (Hidden in print mode) */}
            <Button onClick={handlePrint} className="mb-4 bg-[#E31E24] hover:bg-[#C71D23] text-white print:hidden">
                <Printer className="mr-2 h-4 w-4" />
                Print Invoice
            </Button>

            {/* Printable Invoice Section */}
            <div id="printable" className="px-2">
                {/* Header */}
                <div className="flex justify-center mb-2 -mt-2">
                    <Image src="/logo.png" width={48} height={8} alt="Logo" />
                </div>
                <h1 className="text-sm font-bold text-center -mt-6">Goregaon Dyeing</h1>
                <h2 className="text-[8px] text-center whitespace-nowrap">
                    237/1890, Motilal Nagar No 1, Road No 4, Near Ganesh Mandir, Goregaon West, Mumbai 400 104
                </h2>
                <div className="flex flex-row justify-center gap-2 md:gap-6 text-sm text-[8px] border-b border-dashed border-black">
                    <div className="flex items-center justify-center gap-1">
                        <Phone className="w-2 h-2 text-primary" />
                        <span>+91 91361 99100 / +91 92247 26007</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                        <Globe className="w-2 h-2 text-primary" />
                        <a href="https://goregaondyeing.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                            www.goregaondyeing.com
                        </a>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center my-2">
                    <h1 className="text-sm font-bold uppercase">Invoice</h1>
                </div>

                {/* Invoice Details */}
                <div className="border-b border-dashed border-black pb-2">
                    <div className="flex justify-between text-[10px]">
                        <div className="flex items-center">
                            <FileText className="w-3 h-3 mr-1 text-primary" />
                            <span className="font-semibold">Invoice No:</span>
                            <span className="ml-1">INV-{invoice?.invoiceNo}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1 text-primary" />
                            <span className="font-semibold">Date:</span>
                            <span className="ml-1">{formatDisplayDate(invoice?.date)}</span>
                        </div>
                    </div>

                    <div className="mt-1 text-[10px]">
                        <div className="flex items-center">
                            <User className="w-3 h-3 mr-1 text-primary" />
                            <span className="font-semibold">Client:</span>
                            <span className="ml-1">
                                {clientName} ({invoice?.clientCode})
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-between mt-1 text-[10px]">
                        <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1 text-primary" />
                            <span className="font-semibold">Period:</span>
                            <span className="ml-1">
                                {formatDisplayDate(invoice?.fromDate)} - {formatDisplayDate(invoice?.toDate)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Invoice Breakdown */}
                <div className="mt-2 text-[10px]">
                    <div className="flex justify-between border-b border-dotted pb-1">
                        <span className="font-semibold">Description</span>
                        <span className="font-semibold">Amount</span>
                    </div>

                    <div className="flex justify-between py-1">
                        <span>Services rendered during the period</span>
                        <span>₹ {Number.parseFloat(invoice?.balanceAmount || 0).toFixed(2)}</span>
                    </div>

                    {/* Payment Received Section */}
                    {Array.isArray(invoice?.paymentReceived) && invoice.paymentReceived.length > 0 && (
                        <div className="mt-2 border-t border-dotted pt-1">
                            <div className="font-semibold mb-1">Payment Received:</div>
                            <table className="w-full text-[8px] mb-2">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="text-left p-1">Date</th>
                                        <th className="text-left p-1">Mode</th>
                                        {/* <th className="text-left p-1">Received To</th> */}
                                        <th className="text-right p-1">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.paymentReceived.map((payment, index) => (
                                        <tr key={index} className="border-t border-gray-100">
                                            <td className="p-1">{formatDisplayDate(payment.date)}</td>
                                            <td className="p-1">{payment.mode}</td>
                                            {/* <td className="p-1">{payment.receivedTo}</td> */}
                                            <td className="text-right p-1 text-green-600">
                                                ₹ {Number.parseFloat(payment.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="border-t border-gray-200 font-semibold">
                                        <td colSpan={2} className="p-1 text-right">
                                            Total Payment Received:
                                        </td>
                                        <td className="text-right p-1 text-green-600">₹ {totalPaymentReceived.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="flex justify-between py-1 border-t border-double border-black font-bold mt-2">
                        <span className="text-[10px]">Balance Due:</span>
                        <span>₹ {balanceDue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-1 border-double border-black font-bold mt-2">
                        <span className="text-[10px] balance">In Words: {balanceInWords} Rupeees Only</span>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="mt-4 pt-2 border-t border-dashed border-black">
                    <div className="flex justify-between text-[8px]">
                        <div>
                            <p className="font-semibold">Payment Terms:</p>
                            <p>Due on receipt</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold">For Goregaon Dyeing</p>
                            <p className="mt-6">Authorized Signatory</p>
                        </div>
                    </div>
                    <p className="text-center text-[8px] mt-4">Thank you for your business!</p>
                </div>
            </div>
        </div>
    )
}
