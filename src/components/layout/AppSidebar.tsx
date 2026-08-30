/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Home,
  PieChart,
  Plus,
  Wallet,
  Settings,
  FileText,
  Activity,
  LineChart,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { SettingsDialog } from "./SettingsDialog";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { title: "Dashboard", icon: Home, href: "/" },
  { title: "Income", icon: Wallet, href: "/income" },
  { title: "Expenses", icon: PieChart, href: "/expenses" },
  { title: "Budget", icon: Plus, href: "/budget" },
  { title: "Exchange Rates", icon: Activity, href: "/rates" },
  { title: "Simulation", icon: LineChart, href: "/simulation" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [displayName, setDisplayName] = useState("Money Month");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user;
      if (user?.user_metadata) {
        if (user.user_metadata.display_name) setDisplayName(user.user_metadata.display_name);
        if (user.user_metadata.avatar_url) setLogoUrl(user.user_metadata.avatar_url);
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // AuthGuard will automatically detect the state change and show login form
  };

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader className="p-2 border-b border-border/10 overflow-hidden">
        <div className="flex items-center gap-2 pl-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="w-10 h-10 rounded-lg flex-shrink-0 object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
              MM
            </div>
          )}
          <span className="font-semibold text-lg tracking-tight whitespace-nowrap group-data-[collapsible=icon]:opacity-0 transition-opacity group-data-[collapsible=icon]:hidden">
            {displayName}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    className="group-data-[collapsible=icon]:!w-12 group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!p-3 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center"
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="flex-shrink-0 w-6 h-6" />
                      <span className="whitespace-nowrap group-data-[collapsible=icon]:opacity-0 transition-opacity group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-2 border-t border-border/10 flex flex-col gap-4 overflow-hidden">
        <SettingsDialog
          onProfileUpdate={(newName, newLogo) => {
            if (newName) setDisplayName(newName);
            if (newLogo) setLogoUrl(newLogo);
          }}
        />

        <div
          onClick={handleLogout}
          className="flex items-center gap-2 pl-2 text-sm text-red-500 whitespace-nowrap cursor-pointer hover:text-red-600 transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0"
          title="Logout"
        >
          <LogOut className="w-6 h-6 flex-shrink-0" />
          <span className="group-data-[collapsible=icon]:opacity-0 transition-opacity group-data-[collapsible=icon]:hidden">
            Logout
          </span>
        </div>

        {/* Toggle Sidebar Button */}
        <div className="flex group-data-[collapsible=icon]:justify-center">
          <SidebarTrigger className="ml-1 group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
