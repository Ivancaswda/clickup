// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import {NuqsAdapter} from "nuqs/adapters/next/app";
import {ThemeProvider} from "@/components/theme-provider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: "ClickUp",
    description: "New app made by Ivan Katkowski",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={cn(inter.className, "antialiased min-h-screen")}>
        <ThemeProvider
            attribute='class'
            defaultSystem='dark'
            enableSystem
            disableTransitionOnChange
        >
            <QueryProvider>
                <NuqsAdapter> {/* ✅ client setup изнутри */}
                    {children}
                </NuqsAdapter>
                <Toaster />
            </QueryProvider>
        </ThemeProvider>

        </body>
        </html>
    );
}
