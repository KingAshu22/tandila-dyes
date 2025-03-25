"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation"; // Import the hook to get the current path
import Header from "@/components/Header";
import { AppSidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get the current pathname
  const isAWBPage =
    (pathname.includes("/clients/entries/") && !pathname.includes("/awb/create")) ||
    pathname.includes("/login") ||
    pathname == "/" ||
    pathname.includes("/track");

  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          {!isAWBPage && <AppSidebar />}{" "}
          {/* Only render the sidebar if it's not the AWB page */}
          <main
            className={`flex-grow ${pathname !== "/" ||
              (pathname.includes("/track") &&
                !pathname.includes("/login") &&
                "p-4")
              }`}
          >
            {!isAWBPage && (
              <div className="mb-20">
                <Header />
              </div>
            )}
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
