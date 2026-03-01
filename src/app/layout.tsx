// File: src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { GradientBackground } from "@/components/GradientBackground";
import { ThemeTransition } from "@/components/ThemeTransition";
import { InstallPWA } from "@/components/InstallPWA";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
        <meta name="theme-color" content="#FF69B4" />
        
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ThemeTransition>
            <div className="relative min-h-screen overflow-x-hidden max-w-full">
              {/* Animated gradient background - only visible in light mode */}
              <div className="dark:hidden">
                <GradientBackground />
              </div>
              {children}
            </div>
          </ThemeTransition>
          <InstallPWA />
          <Toaster />
          <SpeedInsights 
            debug={process.env.NODE_ENV === 'production'}
            sampleRate={1}
          />
          <Analytics 
            debug={process.env.NODE_ENV === 'production'}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
