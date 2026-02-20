// File: src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { GradientBackground } from "@/components/GradientBackground";
import { ThemeTransition } from "@/components/ThemeTransition";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ThemeTransition>
            <div className="relative min-h-screen">
              {/* Animated gradient background - only visible in light mode */}
              <div className="dark:hidden">
                <GradientBackground />
              </div>
              {children}
            </div>
          </ThemeTransition>
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
