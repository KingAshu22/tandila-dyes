"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Eye, EyeOff } from "lucide-react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "./ui/textarea"

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    address: z.string(),
    code: z.string().min(3, { message: "Code must be at least 3 characters long" }),
    contact: z.string(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    services: z.array(z.object({
        type: z.string(),
        rate: z.number().min(1, { message: "Rate must be at least 1" })
    })).optional(),
    addOns: z.array(z.object({
        type: z.string(),
        rate: z.number().min(1, { message: "Rate must be at least 1" })
    })).optional()
});

export default function ClientRegisterForm({ isEdit = false, client }) {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const servicesOptions = ["Dyeing", "Redyeing", "Hydro Dyeing", "Fusing"]
    const addOnsOptions = ["Roll Press"]

    // Initialize selectedServices and selectedAddOns with client data if available
    const [selectedServices, setSelectedServices] = useState([])
    const [selectedAddOns, setSelectedAddOns] = useState([])

    // When in edit mode, set the selected services/addOns from the client object
    useEffect(() => {
        if (isEdit && client) {
            setSelectedServices(client.services || [])
            setSelectedAddOns(client.addOns || [])
        }
    }, [isEdit, client])

    const handleServiceChange = (service) => {
        if (selectedServices.some(s => s.type === service)) {
            setSelectedServices(selectedServices.filter(s => s.type !== service))
        } else {
            setSelectedServices([...selectedServices, { type: service, rate: "" }])
        }
    }

    const handleServiceRateChange = (index, value) => {
        const updatedServices = [...selectedServices]
        updatedServices[index].rate = value
        setSelectedServices(updatedServices)
    }

    const handleAddOnChange = (addOn) => {
        if (selectedAddOns.some(a => a.type === addOn)) {
            setSelectedAddOns(selectedAddOns.filter(a => a.type !== addOn))
        } else {
            setSelectedAddOns([...selectedAddOns, { type: addOn, rate: "" }])
        }
    }

    const handleAddOnRateChange = (index, value) => {
        const updatedAddOns = [...selectedAddOns]
        updatedAddOns[index].rate = value
        setSelectedAddOns(updatedAddOns)
    }

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: client?.name || "",
            address: client?.address || "",
            code: client?.code || "",
            contact: client?.contact || "",
            password: client?.password || ""
        }
    })

    // Generate a new client code when not editing
    const getCode = async () => {
        try {
            const response = await axios.get("/api/get-last-client")
            const lastCode = response.data.code // e.g., "0001"
            const incrementedNumber = (parseInt(lastCode, 10) + 1).toString()
            const newCode = incrementedNumber.padStart(4, "0")
            form.setValue("code", newCode)
        } catch (error) {
            console.error("Error fetching code:", error)
        }
    }

    useEffect(() => {
        if (!isEdit) {
            getCode()
        }
    }, [isEdit])

    async function onSubmit(values) {
        try {
            setIsLoading(true)
            const clientData = {
                ...values,
                services: selectedServices.map(s => ({ type: s.type, rate: Number(s.rate) })),
                addOns: selectedAddOns.map(a => ({ type: a.type, rate: Number(a.rate) }))
            }

            const response = await axios.post("/api/clients", clientData)
            if (response.status === 200) {
                alert("Client saved successfully!")
            } else {
                alert("Failed to save the client.")
            }
        } catch (error) {
            console.error("Error saving client:", error)
            alert("An error occurred while saving the client.")
        } finally {
            setIsLoading(false)
            form.reset()
            setSelectedServices([])
            setSelectedAddOns([])
        }
    }

    async function editSubmit(values) {
        try {
            setIsLoading(true)
            const updatedData = {
                ...values,
                services: selectedServices.map(s => ({ type: s.type, rate: Number(s.rate) })),
                addOns: selectedAddOns.map(a => ({ type: a.type, rate: Number(a.rate) }))
            }
            const response = await axios.put(`/api/clients/${values.code}`, updatedData)
            if (response.status === 200) {
                alert("Client edited successfully!")
            } else {
                alert("Failed to edit the client.")
            }
        } catch (error) {
            console.error("Error editing client:", error.response?.data || error.message)
            alert("An error occurred while editing the client.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center text-[#232C65]">
                    {isEdit ? "Edit Client" : "Client Registration"}
                </CardTitle>
                <CardDescription className="text-center">
                    {isEdit ? "Edit Client Account" : "Create a new Client Account"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(isEdit ? editSubmit : onSubmit)} className="space-y-4" autoComplete="off">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter client code" autoComplete="off" readOnly {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter client name" autoComplete="off" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Textarea autoComplete="off" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Services Selection */}
                        <FormItem>
                            <FormLabel>Services</FormLabel>
                            {servicesOptions.map((service) => (
                                <div key={service} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedServices.some(s => s.type === service)}
                                        onChange={() => handleServiceChange(service)}
                                    />
                                    <label>{service}</label>
                                    {selectedServices.some(s => s.type === service) && (
                                        <Input
                                            type="number"
                                            placeholder="Enter rate"
                                            value={selectedServices.find(s => s.type === service)?.rate || ""}
                                            onChange={(e) =>
                                                handleServiceRateChange(selectedServices.findIndex(s => s.type === service), e.target.value)
                                            }
                                        />
                                    )}
                                </div>
                            ))}
                        </FormItem>

                        {/* Add-Ons Selection */}
                        <FormItem>
                            <FormLabel>Add-Ons</FormLabel>
                            {addOnsOptions.map((addOn) => (
                                <div key={addOn} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedAddOns.some(a => a.type === addOn)}
                                        onChange={() => handleAddOnChange(addOn)}
                                    />
                                    <label>{addOn}</label>
                                    {selectedAddOns.some(a => a.type === addOn) && (
                                        <Input
                                            type="number"
                                            placeholder="Enter rate"
                                            value={selectedAddOns.find(a => a.type === addOn)?.rate || ""}
                                            onChange={(e) =>
                                                handleAddOnRateChange(selectedAddOns.findIndex(a => a.type === addOn), e.target.value)
                                            }
                                        />
                                    )}
                                </div>
                            ))}
                        </FormItem>

                        <FormField
                            control={form.control}
                            name="contact"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact No.</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Enter Contact No." autoComplete="off" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter password"
                                                autoComplete="off"
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(prev => !prev)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-[#E31E24] hover:bg-[#C71D23] text-white" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isEdit ? "Updating..." : "Registering..."}
                                </>
                            ) : (
                                isEdit ? "Update Client" : "Create Client"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
