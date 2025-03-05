"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Plus, Minus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import SingleSearch from "./SingleSearch"
import Modal from "./Modal"
import { useRouter } from "next/navigation"

export default function EntriesForm({ isEdit = false, entry }) {
    const router = useRouter()
    const [success, setSuccess] = useState(false)
    const [date, setDate] = useState(entry?.date || Date.now())
    const [batchNo, setBatchNo] = useState(entry?.parcelType || "")
    const [clients, setClients] = useState([])
    const [clientName, setClientName] = useState("")
    const [clientCode, setClientCode] = useState(entry?.clientCode || "")
    const [vrNo, setVrNo] = useState(entry?.vrNo || "")
    const [workOrder, setWorkOrder] = useState(
        entry?.workOrder || [
            {
                orderNo: "",
                description: "",
                quantity: "",
                unit: "mtr",
                rate: 0,
                amount: 0,
                outDate: null,
                remarks: "",
            },
        ],
    )
    useEffect(() => {
        fetchClients();
        !isEdit && getBatchNo()
    }, []);

    useEffect(() => {
        if (clientName) {
            const client = clients.find((c) => c.name === clientName);
            setClientCode(client?.code);
        }
    }, [clientName])

    const fetchClients = async () => {
        try {
            const response = await axios.get("/api/clients");
            console.log(response.data);
            setClients(response.data);
        } catch (error) {
            console.error("Error fetching clients:", error);
        }
    };

    const getBatchNo = async () => {
        try {
            const response = await axios.get("/api/get-last-entry")
            const lastbatchNo = response.data.batchNo
            const incrementedNumber = (Number.parseInt(lastbatchNo) + 1).toString()

            // Construct the new invoice number
            const newInvoiceNumber = incrementedNumber

            // Set the new invoice number
            setBatchNo(newInvoiceNumber);
        } catch (error) {
            console.error("Error fetching parcel:", error)
            // setError("Failed to fetch parcel. Please try again later.");
        }
    }

    const addWorkOrder = () => {
        setWorkOrder([
            ...workOrder,
            {
                orderNo: "",
                description: "",
                quantity: "",
                unit: "mtr",
                rate: 0,
                amount: 0,
                outDate: null,
                remarks: "",
            },
        ])
    }

    const handleWorkOrderChange = (index, field, value) => {
        const updatedWorkOrders = [...workOrder]
        updatedWorkOrders[index][field] = value

        setWorkOrder(updatedWorkOrders)
    }

    const removeWorkOrder = (orderIndex) => {
        const updatedWorkOrders = [...workOrder]
        updatedWorkOrders.splice(orderIndex, 1)
        setWorkOrder(updatedWorkOrders)
    }

    const handleSubmit = async (e) => {
        e.preventDefault() // Prevent default form submission
        try {
            console.log("Inside Save Entry Function")
            const entryData = {
                batchNo,
                date,
                clientCode,
                vrNo,
                workOrder,
            }

            const response = await axios.post("/api/entry", entryData)

            if (response.status === 200) {
                console.log("Entry saved successfully:", response.data)
                setSuccess(true)
            } else {
                console.error("Failed to save Entry Data:", response.data)
                alert("Failed to save the Entry. Please try again.")
            }
        } catch (error) {
            console.error("Error saving Entry:", error.response?.data || error.message)
            alert("An error occurred while saving the entry.")
        }
    }

    const editSubmit = async (e) => {
        e.preventDefault() // Prevent default form submission
        try {
            console.log("Inside Edit Entry Function")
            const entryData = {
                batchNo,
                date,
                clientCode,
                vrNo,
                workOrder,
            }

            const response = await axios.put(`/api/entry/${batchNo}`, entryData)

            if (response.status === 200) {
                console.log("Entry updated successfully:", response.data)
                setSuccess(true)
            } else {
                console.error("Failed to update entry:", response.data)
                alert("Failed to update the entry. Please try again.")
            }
        } catch (error) {
            console.error("Error updating entry:", error.response?.data || error.message)
            alert("An error occurred while updating the entry.")
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-[#232C65]">{isEdit ? "Edit Entry" : "Create Entry"}</h1>
            <form onSubmit={isEdit ? editSubmit : handleSubmit} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl text-[#232C65]">Basic Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <SingleSearch
                                type="Client Name"
                                list={clients.map(client => client.name)}
                                selectedItem={clientName}
                                setSelectedItem={setClientName}
                                showSearch={true}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="trackingNumber">Client Code:</Label>
                            <Input
                                id="clientCode"
                                type="number"
                                placeholder="Client Code"
                                value={clientCode}
                                onChange={(e) => setClientCode(e.target.value)}
                                readOnly
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Select Parcel Date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vrNo">Challan No:</Label>
                            <Input
                                id="vrNo"
                                type="text"
                                placeholder="Challan No"
                                value={vrNo}
                                onChange={(e) => setVrNo(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="batchNo">Batch No:</Label>
                            <Input
                                id="batchNo"
                                type="text"
                                placeholder="Batch No"
                                value={batchNo}
                                onChange={(e) => setBatchNo(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl text-[#232C65]">Work Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {workOrder.map((work, workIndex) => (
                            <Card key={workIndex}>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-xl text-[#232C65]">Work Order No {workIndex + 1}</CardTitle>
                                    {workIndex > 0 && (
                                        <Button type="button" variant="destructive" size="sm" onClick={() => removeWorkOrder(workIndex)}>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Remove Work Order
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`description-${workIndex}`}>Description</Label>
                                            <Input
                                                id={`description-${workIndex}`}
                                                type="text"
                                                placeholder="Description"
                                                value={work.description || ""}
                                                onChange={(e) => handleWorkOrderChange(workIndex, "description", e.target.value || "")}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`quantity-${workIndex}`}>Quantity</Label>
                                            <Input
                                                id={`quantity-${workIndex}`}
                                                type="number"
                                                placeholder="Quantity"
                                                value={work.quantity || ""}
                                                onChange={(e) => handleWorkOrderChange(workIndex, "quantity", Number.parseFloat(e.target.value) || "")}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`unit-${workIndex}`}>Unit</Label>
                                            <Select value={work.unit} onValueChange={(e) => handleWorkOrderChange(workIndex, "unit", e.target.value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="mtr">mtr</SelectItem>
                                                    <SelectItem value="g">gram</SelectItem>
                                                    <SelectItem value="kg">kg</SelectItem>
                                                    <SelectItem value="nos">nos</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`rate-${workIndex}`}>Rate</Label>
                                            <Input
                                                id={`rate-${workIndex}`}
                                                type="number"
                                                placeholder="Rate"
                                                value={work.rate || ""}
                                                onChange={(e) =>
                                                    handleWorkOrderChange(workIndex, "rate", Number.parseFloat(e.target.value) || "")
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`amount-${workIndex}`}>Amount</Label>
                                            <Input
                                                id={`amount-${workIndex}`}
                                                type="number"
                                                placeholder="Amount"
                                                value={work.amount || ""}
                                                onChange={(e) =>
                                                    handleWorkOrderChange(workIndex, "amount", Number.parseFloat(e.target.value) || "")
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`remarks-${workIndex}`}>Remarks</Label>
                                            <Input
                                                id={`remarks-${workIndex}`}
                                                type="text"
                                                placeholder="Remarks"
                                                value={work.remarks || ""}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        <Button type="button" variant="outline" onClick={addWorkOrder} className="mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Work Order
                        </Button>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" className="bg-[#E31E24] hover:bg-[#C71D23] text-white">
                        {isEdit ? "Update Entry" : "Create Entry"}
                    </Button>
                </div>
            </form>
            <Modal
                isOpen={success}
                onClose={() => setSuccess(false)}
                title={`Entry ${isEdit ? "Updated" : "Created"} Successfully`}
                description={`The Entry has been ${isEdit ? "updated" : "created"
                    } successfully. Click the button below to view Entry or go back to Entry Table.`}
            >
                <div className="flex justify-center gap-2">
                    <button
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        type="button"
                        onClick={() => router.push(`/entries/${trackingNumber}`)}
                    >
                        View Entry
                    </button>
                    <button
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        type="button"
                        onClick={() => router.push(`/entries`)}
                    >
                        Back to Entry Table
                    </button>
                </div>
            </Modal>
        </div>
    )
}

