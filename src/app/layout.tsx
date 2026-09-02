// File: src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { InstallPWA } from "@/components/layout/InstallPWA";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { StoreInitializer } from "@/components/layout/StoreInitializer";

export const metadata: Metadata = {
  title: "Personal Finance Manager",
  description: "Track your income and expenses with ease",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Finance App",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Personal Finance Manager",
    title: "Personal Finance Manager",
    description: "Track your income and expenses with style",
  },
  twitter: {
    card: "summary",
    title: "Personal Finance Manager",
    description: "Track your income and expenses with style",
  },
};

import { PaydayOnboarding } from "@/components/layout/PaydayOnboarding";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Finance App" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Finance App" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#fff0f5" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1a0f14" media="(prefers-color-scheme: dark)" />

        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      {/* ponytail: removed next/font/google bloat, using native system fonts */}
      <body className="font-sans antialiased text-foreground bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* ponytail: removed ThemeTransition bloat */}
          <AuthGuard>
            <StoreInitializer>
              <PaydayOnboarding />
              <SidebarProvider defaultOpen={false}>
                <AppSidebar />
                <SidebarInset className="relative min-h-screen overflow-x-hidden max-w-full flex-col">
                  {children}
                </SidebarInset>
              </SidebarProvider>
            </StoreInitializer>
          </AuthGuard>
          <InstallPWA />
          <Toaster />
          <SpeedInsights debug={process.env.NODE_ENV === "production"} sampleRate={1} />
          <Analytics debug={process.env.NODE_ENV === "production"} />
        </ThemeProvider>
      </body>
    </html>
  );
}
