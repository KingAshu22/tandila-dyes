"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { HashLoader } from "react-spinners"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Users, Package, IndianRupee } from "lucide-react"
import withAuth from "@/lib/withAuth"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  XAxis,
  YAxis,
} from "recharts"

function Dashboard() {
  const [entries, setEntries] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeRange, setTimeRange] = useState("today")
  const [clientFilter, setClientFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [filteredByTimeEntries, setFilteredByTimeEntries] = useState([])

  useEffect(() => {
    fetchEntries()
    fetchClients()
  }, [])

  // Apply time range filter whenever timeRange changes or entries/clients are loaded
  useEffect(() => {
    if (entries.length > 0) {
      const timeFilteredData = getDateRangeData()
      setFilteredByTimeEntries(timeFilteredData)
    }
  }, [timeRange, entries])

  const fetchEntries = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get("/api/entry")
      setEntries(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching entries:", error)
      setError("Failed to fetch entries. Please try again later.")
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await axios.get("/api/clients")
      setClients(response.data)
    } catch (error) {
      console.error("Error fetching clients:", error)
    }
  }

  // Get client name from client code
  const getClientName = (clientCode) => {
    if (clientCode === "all") return "All Clients"

    const client = clients.find((c) => c.code === clientCode)
    return client ? client.name : clientCode
  }

  // Extract unique client codes for filtering
  const uniqueClients = entries.length > 0 ? ["all", ...new Set(entries.map((entry) => entry.clientCode))] : ["all"]

  // Extract unique services for filtering
  const uniqueServices =
    entries.length > 0
      ? ["all", ...new Set(entries.flatMap((entry) => entry.workOrder.map((order) => order.service)))]
      : ["all"]

  // Prepare data for time range filtering
  const getDateRangeData = () => {
    const now = new Date()
    let startDate, endDate

    if (timeRange === "today") {
      startDate = new Date(now)
      startDate.setHours(0, 0, 0, 0) // Start of today
      endDate = new Date(now)
      endDate.setHours(23, 59, 59, 999) // End of today
    } else if (timeRange === "week") {
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
      endDate = new Date(now)
    } else if (timeRange === "month") {
      startDate = new Date(now)
      startDate.setMonth(now.getMonth() - 1)
      endDate = new Date(now)
    } else if (timeRange === "year") {
      startDate = new Date(now)
      startDate.setFullYear(now.getFullYear() - 1)
      endDate = new Date(now)
    }

    return entries.filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate >= startDate && entryDate <= endDate
    })
  }

  // Filter entries based on selected filters
  const filteredEntries = filteredByTimeEntries.filter((entry) => {
    const matchesClient = clientFilter === "all" || entry.clientCode === clientFilter
    const matchesService = serviceFilter === "all" || entry.workOrder.some((order) => order.service === serviceFilter)
    return matchesClient && matchesService
  })

  // Calculate summary statistics
  const totalOrders = filteredEntries.reduce((sum, entry) => sum + entry.workOrder.length, 0)
  const totalRevenue = filteredEntries.reduce(
    (sum, entry) => sum + entry.workOrder.reduce((orderSum, order) => orderSum + order.amount, 0),
    0,
  )
  const totalQuantity = filteredEntries.reduce(
    (sum, entry) => sum + entry.workOrder.reduce((orderSum, order) => orderSum + order.quantity, 0),
    0,
  )
  const uniqueClientsCount = new Set(filteredEntries.map((entry) => entry.clientCode)).size

  // Revenue by date chart data
  const revenueByDateData = () => {
    const dateMap = new Map()

    // For today, show hourly data
    if (timeRange === "today") {
      for (let hour = 0; hour < 24; hour++) {
        dateMap.set(`${hour}:00`, 0)
      }

      filteredEntries.forEach((entry) => {
        const date = new Date(entry.date)
        const hour = date.getHours()
        const hourKey = `${hour}:00`

        const revenue = entry.workOrder.reduce((sum, order) => sum + order.amount, 0)

        if (dateMap.has(hourKey)) {
          dateMap.set(hourKey, dateMap.get(hourKey) + revenue)
        }
      })
    } else {
      filteredEntries.forEach((entry) => {
        const date = new Date(entry.date)
        let dateKey

        if (timeRange === "week") {
          dateKey = date.toLocaleDateString("en-US", { weekday: "short" })
        } else if (timeRange === "month") {
          dateKey = date.toLocaleDateString("en-US", { day: "2-digit", month: "short" })
        } else {
          dateKey = date.toLocaleDateString("en-US", { month: "short" })
        }

        const revenue = entry.workOrder.reduce((sum, order) => sum + order.amount, 0)

        if (dateMap.has(dateKey)) {
          dateMap.set(dateKey, dateMap.get(dateKey) + revenue)
        } else {
          dateMap.set(dateKey, revenue)
        }
      })
    }

    return Array.from(dateMap, ([date, revenue]) => ({ date, revenue }))
  }

  // Service distribution chart data
  const serviceDistributionData = () => {
    if (!filteredEntries || filteredEntries.length === 0) {
      return [{ name: "No Data", value: 1 }]
    }

    const serviceMap = new Map()

    filteredEntries.forEach((entry) => {
      if (entry.workOrder && Array.isArray(entry.workOrder)) {
        entry.workOrder.forEach((order) => {
          if (order && order.service) {
            const service = order.service
            const quantity = order.quantity || 0

            if (serviceMap.has(service)) {
              serviceMap.set(service, serviceMap.get(service) + quantity)
            } else {
              serviceMap.set(service, quantity)
            }
          }
        })
      }
    })

    // If no services were found, return a placeholder
    if (serviceMap.size === 0) {
      return [{ name: "No Data", value: 1 }]
    }

    return Array.from(serviceMap, ([name, value]) => ({ name, value }))
  }

  // Client distribution chart data
  const clientDistributionData = () => {
    if (!filteredEntries || filteredEntries.length === 0) {
      return [{ name: "No Data", value: 1 }]
    }

    const clientMap = new Map()

    filteredEntries.forEach((entry) => {
      if (entry && entry.clientCode) {
        const clientCode = entry.clientCode
        const clientName = getClientName(clientCode)

        let revenue = 0
        if (entry.workOrder && Array.isArray(entry.workOrder)) {
          revenue = entry.workOrder.reduce((sum, order) => sum + (order.amount || 0), 0)
        }

        if (clientMap.has(clientName)) {
          clientMap.set(clientName, clientMap.get(clientName) + revenue)
        } else {
          clientMap.set(clientName, revenue)
        }
      }
    })

    // If no clients were found, return a placeholder
    if (clientMap.size === 0) {
      return [{ name: "No Data", value: 1 }]
    }

    return Array.from(clientMap, ([name, value]) => ({ name, value }))
  }

  // Processing time analysis
  const processingTimeData = () => {
    if (!filteredEntries || filteredEntries.length === 0) {
      return [{ service: "No Data", avgDays: 0 }]
    }

    const serviceTimeMap = new Map()

    filteredEntries.forEach((entry) => {
      if (entry.workOrder && Array.isArray(entry.workOrder)) {
        entry.workOrder.forEach((order) => {
          if (order && order.service && order.inDate && order.outDate) {
            const service = order.service
            const inDate = new Date(order.inDate)
            const outDate = new Date(order.outDate)
            const processingDays = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24))

            if (serviceTimeMap.has(service)) {
              const current = serviceTimeMap.get(service)
              serviceTimeMap.set(service, {
                totalDays: current.totalDays + processingDays,
                count: current.count + 1,
              })
            } else {
              serviceTimeMap.set(service, {
                totalDays: processingDays,
                count: 1,
              })
            }
          }
        })
      }
    })

    // If no processing times were found, return a placeholder
    if (serviceTimeMap.size === 0) {
      return [{ service: "No Data", avgDays: 0 }]
    }

    return Array.from(serviceTimeMap, ([service, data]) => ({
      service,
      avgDays: data.totalDays / data.count,
    }))
  }

  // Monthly trend data
  const monthlyTrendData = () => {
    if (!filteredEntries || filteredEntries.length === 0) {
      return [{ month: "No Data", revenue: 0, quantity: 0 }]
    }

    const monthMap = new Map()

    filteredEntries.forEach((entry) => {
      if (entry && entry.date) {
        const date = new Date(entry.date)
        const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

        let revenue = 0
        let quantity = 0

        if (entry.workOrder && Array.isArray(entry.workOrder)) {
          revenue = entry.workOrder.reduce((sum, order) => sum + (order.amount || 0), 0)
          quantity = entry.workOrder.reduce((sum, order) => sum + (order.quantity || 0), 0)
        }

        if (monthMap.has(monthKey)) {
          const current = monthMap.get(monthKey)
          monthMap.set(monthKey, {
            revenue: current.revenue + revenue,
            quantity: current.quantity + quantity,
          })
        } else {
          monthMap.set(monthKey, {
            revenue,
            quantity,
          })
        }
      }
    })

    // If no monthly data was found, return a placeholder
    if (monthMap.size === 0) {
      return [{ month: "No Data", revenue: 0, quantity: 0 }]
    }

    return Array.from(monthMap, ([month, data]) => ({
      month,
      revenue: data.revenue,
      quantity: data.quantity,
    }))
  }

  // Colors for charts
  const COLORS = ["#E31E24", "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  // Format time range for display
  const getTimeRangeDisplay = () => {
    const now = new Date()

    if (timeRange === "today") {
      return now.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
    } else if (timeRange === "week") {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - 7)
      return `${weekStart.toLocaleDateString("en-US", { day: "numeric", month: "short" })} - ${now.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`
    } else if (timeRange === "month") {
      const monthStart = new Date(now)
      monthStart.setMonth(now.getMonth() - 1)
      return `${monthStart.toLocaleDateString("en-US", { day: "numeric", month: "short" })} - ${now.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`
    } else if (timeRange === "year") {
      const yearStart = new Date(now)
      yearStart.setFullYear(now.getFullYear() - 1)
      return `${yearStart.toLocaleDateString("en-US", { month: "short", year: "numeric" })} - ${now.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
    }

    return ""
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center p-10">
          <HashLoader color="#E31E24" size={80} />
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="container mx-auto py-10 text-red-500">{error}</div>
  }

  // Prepare chart data in advance to avoid multiple calculations
  const serviceData = serviceDistributionData()
  const clientData = clientDistributionData()
  const processingData = processingTimeData()
  const monthlyData = monthlyTrendData()
  const revenueData = revenueByDateData()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome Back, <span className="text-[#E31E24]">{localStorage?.getItem("name")}!</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by client" />
            </SelectTrigger>
            <SelectContent>
              {uniqueClients.map((clientCode) => (
                <SelectItem key={clientCode} value={clientCode}>
                  {getClientName(clientCode)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by service" />
            </SelectTrigger>
            <SelectContent>
              {uniqueServices.map((service) => (
                <SelectItem key={service} value={service}>
                  {service === "all" ? "All Services" : service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing data for: <span className="font-medium">{getTimeRangeDisplay()}</span>
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For {filteredEntries.length} entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Work Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">Across {filteredEntries.length} entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Mtrs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Units processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueClientsCount}</div>
            <p className="text-xs text-muted-foreground">Unique clients</p>
          </CardContent>
        </Card>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">No data available for the selected filters</p>
        </div>
      ) : (
        <>
          <Tabs defaultValue="revenue" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
              <TabsTrigger value="services">Service Analysis</TabsTrigger>
              <TabsTrigger value="clients">Client Analysis</TabsTrigger>
              <TabsTrigger value="processing">Processing Time</TabsTrigger>
            </TabsList>

            {/* Revenue Analysis Tab */}
            <TabsContent value="revenue">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ChartContainer
                      config={{
                        revenue: {
                          label: "Revenue",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                    >
                      <AreaChart
                        accessibilityLayer
                        data={revenueData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#E31E24" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#E31E24" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#E31E24"
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ChartContainer
                      config={{
                        revenue: {
                          label: "Revenue",
                          color: "hsl(var(--chart-1))",
                        },
                        quantity: {
                          label: "Quantity",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                    >
                      <BarChart
                        accessibilityLayer
                        data={monthlyData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" orientation="left" stroke="#E31E24" />
                        <YAxis yAxisId="right" orientation="right" stroke="#0088FE" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar yAxisId="left" dataKey="revenue" fill="#E31E24" />
                        <Bar yAxisId="right" dataKey="quantity" fill="#0088FE" />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Service Analysis Tab */}
            <TabsContent value="services">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ChartContainer>
                      <RechartsPieChart>
                        <Pie
                          data={serviceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            name === "No Data" ? "No Data" : `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {serviceData.map((entry, index) => (
                            <Cell key={`service-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </RechartsPieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Service Quantity Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ChartContainer>
                      <BarChart
                        accessibilityLayer
                        data={serviceData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={100} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill="#E31E24">
                          {serviceData.map((entry, index) => (
                            <Cell key={`service-bar-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Client Analysis Tab */}
            <TabsContent value="clients">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Revenue Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ChartContainer>
                      <RechartsPieChart>
                        <Pie
                          data={clientData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            name === "No Data" ? "No Data" : `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {clientData.map((entry, index) => (
                            <Cell key={`client-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </RechartsPieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Client Revenue Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ChartContainer>
                      <BarChart
                        accessibilityLayer
                        data={clientData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={100} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill="#0088FE">
                          {clientData.map((entry, index) => (
                            <Cell key={`client-bar-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Processing Time Tab */}
            <TabsContent value="processing">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Average Processing Time by Service</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ChartContainer
                      config={{
                        avgDays: {
                          label: "Average Days",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                    >
                      <BarChart
                        accessibilityLayer
                        data={processingData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="service" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="avgDays" fill="#00C49F">
                          {processingData.map((entry, index) => (
                            <Cell key={`processing-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Processing Efficiency</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ChartContainer
                      config={{
                        avgDays: {
                          label: "Average Days",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                    >
                      <LineChart
                        accessibilityLayer
                        data={processingData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="service" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="avgDays" stroke="#E31E24" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Additional Analysis Section */}
          {filteredEntries.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Batch Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ChartContainer
                      config={{
                        quantity: {
                          label: "Quantity",
                          color: "hsl(var(--chart-1))",
                        },
                        amount: {
                          label: "Amount",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                    >
                      <BarChart
                        accessibilityLayer
                        data={filteredEntries.slice(0, 10).map((entry) => ({
                          batchNo: entry.batchNo,
                          client: getClientName(entry.clientCode),
                          quantity: entry.workOrder.reduce((sum, order) => sum + (order.quantity || 0), 0),
                          amount: entry.workOrder.reduce((sum, order) => sum + (order.amount || 0), 0),
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="batchNo" />
                        <YAxis yAxisId="left" orientation="left" stroke="#E31E24" />
                        <YAxis yAxisId="right" orientation="right" stroke="#0088FE" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar yAxisId="left" dataKey="quantity" fill="#E31E24" />
                        <Bar yAxisId="right" dataKey="amount" fill="#0088FE" />
                        <Legend />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default withAuth(Dashboard)

