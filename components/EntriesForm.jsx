"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import SingleSearch from "./SingleSearch"
import Modal from "./Modal"
import { useRouter } from "next/navigation"

export default function EntriesForm({ isEdit = false, entry }) {
    const router = useRouter()
    const [success, setSuccess] = useState(false)
    const [date, setDate] = useState(entry?.date || Date.now())
    const [batchNo, setBatchNo] = useState(entry?.batchNo || "")
    const [clients, setClients] = useState([])
    const [staffs, setStaffs] = useState([])
    const [clientName, setClientName] = useState("")
    const [clientCode, setClientCode] = useState(entry?.clientCode || "")
    const [vrNo, setVrNo] = useState(entry?.vrNo || "")
    const [workOrder, setWorkOrder] = useState(
        entry?.workOrder || [
            {
                orderNo: "",
                staffCode: "",
                description: "",
                service: "",
                quantity: "",
                unit: "mtr",
                rate: 0,
                amount: 0,
                inDate: null,
                outDate: null,
                remarks: "",
            },
        ],
    )
    useEffect(() => {
        fetchClients()
        fetchStaffs()
        !isEdit && getBatchNo()
        !isEdit && getWorkOrder();
    }, [isEdit, entry])

    useEffect(() => {
        if (clientName) {
            const client = clients.find((c) => c.name === clientName)
            setClientCode(client?.code)
        }
    }, [clientName, clients]);

    const fetchClients = async () => {
        try {
            const response = await axios.get("/api/clients")
            setClients(response.data)
        } catch (error) {
            console.error("Error fetching clients:", error)
        }
    }

    const fetchStaffs = async () => {
        try {
            const response = await axios.get("/api/staffs")
            setStaffs(response.data)
        } catch (error) {
            console.error("Error fetching staffs:", error)
        }
    }

    const getBatchNo = async () => {
        try {
            const response = await axios.get("/api/get-last-entry")
            const batchNo = response.data.batchNo
            setBatchNo(batchNo)
        } catch (error) {
            console.error("Error fetching batchNo:", error)
        }
    }

    const getWorkOrder = async () => {
        try {
            const response = await axios.get("/api/get-last-work-order")
            const workOrder = response.data.workOrder;
            handleWorkOrderChange(0, "orderNo", workOrder)
        } catch (error) {
            console.error("Error fetching batchNo:", error)
        }
    }

    const getNextOrderNo = () => {
        if (workOrder.length === 0) return ""

        // Get the last order number from the workOrder array
        const lastOrder = workOrder[workOrder.length - 1]
        const lastOrderNo = lastOrder.orderNo

        // If there's no valid order number, return an empty string
        if (!lastOrderNo) return ""

        // Parse the order number format: WO-20250306-001
        console.log("Last Order Number:", lastOrderNo)
        const parts = lastOrderNo.split("-")
        if (parts.length !== 3) return ""

        // Extract the prefix, date part, and sequence number
        const prefix = parts[0]
        const datePart = parts[1]
        const sequenceStr = parts[2]

        // Convert sequence to number, increment, and format back to 3 digits
        const sequence = Number.parseInt(sequenceStr, 10)
        const nextSequence = sequence + 1
        const nextSequenceStr = nextSequence.toString().padStart(3, "0")

        // Combine all parts back together
        return `${prefix}-${datePart}-${nextSequenceStr}`
    }

    const addWorkOrder = () => {
        const newWorkOrder = getNextOrderNo()

        setWorkOrder([
            ...workOrder,
            {
                orderNo: newWorkOrder,
                staffCode: "",
                description: "",
                service: "",
                quantity: "",
                unit: "mtr",
                rate: 0,
                amount: 0,
                inDate: null,
                outDate: null,
                remarks: "",
            },
        ])
    }

    const handleStaffChange = (workIndex, selectedStaffName) => {
        const staff = staffs.find((s) => s.name === selectedStaffName)
        handleWorkOrderChange(workIndex, "staffName", selectedStaffName)
        handleWorkOrderChange(workIndex, "staffCode", staff?.code || "")
    }

    const handleServiceChange = async (workIndex, service) => {
        handleWorkOrderChange(workIndex, "service", service);

        if (!clientName) return;

        const client = clients.find((c) => c.name === clientName);
        if (!client) return;

        try {
            const response = await axios.get(`/api/clients/${client.code}`);
            const clientData = response.data;

            // Check if response is an array and extract the first item if necessary
            const clientObj = Array.isArray(clientData) ? clientData[0] : clientData;

            console.log("Client data:", clientObj);
            console.log("Service Selected:", service);

            // Trim whitespace and ensure correct case for comparison
            const selectedService = service.trim();

            // Find the matching service in the services array
            const serviceRate = clientObj.services?.find(
                (s) => s.type.trim().toLowerCase() === selectedService.toLowerCase()
            )?.rate;

            console.log("Service rate:", serviceRate);

            handleWorkOrderChange(workIndex, "rate", serviceRate);
        } catch (error) {
            console.error("Error fetching service rate:", error);
        }
    };

    const handleWorkOrderChange = (index, field, value) => {
        const updatedWorkOrders = [...workOrder]
        updatedWorkOrders[index][field] = value

        if (["quantity", "rate"].includes(field)) {
            const order = updatedWorkOrders[index];
            const amount = Math.round((order.quantity * order.rate));
            updatedWorkOrders[index].amount = amount;
        }

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
                                list={clients.map((client) => client.name)}
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
                            <Label htmlFor="vrNo">Vendor Challan No:</Label>
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
                                readOnly={true}
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
                                    <CardTitle className="text-xl text-[#232C65]">{workOrder[workIndex].orderNo}</CardTitle>
                                    {workIndex > 0 && (
                                        <Button type="button" variant="destructive" size="sm" onClick={() => removeWorkOrder(workIndex)}>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Remove Work Order
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                                            <Label htmlFor={`service-${workIndex}`}>Select Service</Label>
                                            <Select value={work.service} onValueChange={(value) => handleServiceChange(workIndex, value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Service" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Dyeing">Dyeing</SelectItem>
                                                    <SelectItem value="Redyeing">Redyeing</SelectItem>
                                                    <SelectItem value="Hydro Dyeing">Hydro Dyeing</SelectItem>
                                                    <SelectItem value="Fusing">Fusing</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`quantity-${workIndex}`}>Quantity</Label>
                                            <Input
                                                id={`quantity-${workIndex}`}
                                                type="number"
                                                placeholder="Quantity"
                                                value={work.quantity || ""}
                                                onChange={(e) =>
                                                    handleWorkOrderChange(workIndex, "quantity", Number.parseFloat(e.target.value) || "")
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`unit-${workIndex}`}>Unit</Label>
                                            <Select
                                                value={work.unit}
                                                onValueChange={(e) => handleWorkOrderChange(workIndex, "unit", e.target.value)}
                                            >
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
                                                readOnly={true}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`staff-${workIndex}`}>Select Staff</Label>
                                            <Select value={work.staffName} onValueChange={(value) => handleStaffChange(workIndex, value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Staff" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {staffs.map((staff) => <SelectItem key={staff.code} value={staff.name}>{staff.name}
                                                    </SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`staffCode-${workIndex}`}>Staff Code</Label>
                                            <Input value={work.staffCode} readOnly placeholder="Staff Code" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`remarks-${workIndex}`}>Remarks</Label>
                                            <Input
                                                id={`remarks-${workIndex}`}
                                                type="text"
                                                placeholder="Remarks"
                                                value={work.remarks || ""}
                                                onChange={(e) =>
                                                    handleWorkOrderChange(workIndex, "remarks", e.target.value)}
                                            />
                                        </div>

                                        {/* In Date & Time (IST) */}
                                        <div className="space-y-2">
                                            <Label htmlFor={`inDate-${workIndex}`}>In Date & Time</Label>
                                            <Input
                                                id={`inDate-${workIndex}`}
                                                type="datetime-local"
                                                value={work.inDate ? new Date(work.inDate).toISOString().slice(0, 16) : ""}
                                                onChange={(e) => {
                                                    const selectedDate = new Date(e.target.value);
                                                    selectedDate.setHours(selectedDate.getHours() + 5, selectedDate.getMinutes() + 30); // Convert to IST
                                                    handleWorkOrderChange(workIndex, "inDate", selectedDate);
                                                }}
                                                required
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

