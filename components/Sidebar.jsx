import {
  LayoutDashboard,
  User,
  Box,
  Files,
  Sun,
  IndianRupee
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

export function AppSidebar() {
  const [userType, setUserType] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserType(localStorage?.getItem("userType"));
    }
  });

  // Menu items
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Entries",
      url: "/entries",
      icon: Files,
    },
    {
      title: "Clients",
      url: "/clients",
      icon: User,
    },
    {
      title: "Staffs",
      url: "/staffs",
      icon: Box,
    },
    {
      title: "Invoice",
      url: "/invoice",
      icon: IndianRupee,
    },
    // Add Clients menu item conditionally
    ...(userType === "admin"
      ? [
        {
          title: "Managers",
          url: "/managers",
          icon: Box,
        },
      ]
      : []),
  ];
  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4 text-center">
          <Sun />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="py-8">
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
