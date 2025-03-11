"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Eye, EyeOff } from "lucide-react" // Import eye icons
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    code: z.string().min(3, { message: "Code must be at least 3 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
})

export default function ManagerRegisterForm({ isEdit = false, manager }) {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false) // State to toggle password visibility

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: manager?.name || "",
            code: manager?.code || "",
            email: manager?.email || "",
            password: manager?.password || "",
        },
    });

    const getCode = async () => {
        try {
            const response = await axios.get("/api/get-last-manager");
            const lastCode = response.data.code; // Assume the last code is a string like "0001"
            const incrementedNumber = (parseInt(lastCode, 10) + 1).toString(); // Increment the code
            const newCode = incrementedNumber.padStart(4, "0"); // Pad with leading zeros to make it 4 digits

            // Update the form field for code
            form.setValue("code", newCode); // Set the code in the form state
        } catch (error) {
            console.error("Error fetching code:", error);
        }
    };

    useEffect(() => {
        !isEdit &&
            getCode();
    }, [])

    async function onSubmit(values) {
        try {
            setIsLoading(true)
            console.log("Inside Save manager Function")
            const response = await axios.post("/api/managers", values)

            if (response.status === 200) {
                console.log("manager saved successfully:", response.data)
                alert("manager saved successfully!")
            } else {
                console.error("Failed to save manager:", response.data)
                alert("Failed to save the manager. Please try again.")
            }
        } catch (error) {
            console.error("Error saving manager:", error.response?.data || error.message)
            alert("An error occurred while saving the manager.")
        } finally {
            console.log(values)
            setIsLoading(false)
            form.reset()
        }
    }

    async function editSubmit(values) {
        try {
            setIsLoading(true)
            console.log("Inside Edit manager Function")
            const response = await axios.put(`/api/managers/${values.code}`, values)

            if (response.status === 200) {
                console.log("manager edited successfully:", response.data)
                alert("manager edited successfully!")
            } else {
                console.error("Failed to edit manager:", response.data)
                alert("Failed to edit the manager. Please try again.")
            }
        } catch (error) {
            console.error("Error editing manager:", error.response?.data || error.message)
            alert("An error occurred while editing the manager.")
        } finally {
            console.log(values)
            setIsLoading(false)
            form.reset()
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center text-[#232C65]">{isEdit ? "Edit Manager" : "Manager Registration"}</CardTitle>
                <CardDescription className="text-center">{isEdit ? "Edit Manager Account" : "Create a new Manager Account"}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={isEdit ? form.handleSubmit(editSubmit) : form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter manager code" autoComplete="off" readOnly={true}  {...field} />
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
                                        <Input placeholder="Enter manager name" autoComplete="off" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Enter Email" autoComplete="off" {...field} />
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
                                                onClick={() => setShowPassword((prev) => !prev)}
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
                                isEdit ? "Update Manager" : "Create Manager"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
