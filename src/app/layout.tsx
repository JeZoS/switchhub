import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ReactQueryProvider from "@/react-query";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "SwitchHub.co",
    description: "Switch to something better. ",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        // enableSystem
                        disableTransitionOnChange
                    >
                        {/* {children} */}
                        <ReactQueryProvider>{children}</ReactQueryProvider>
                    </ThemeProvider>
                    <Toaster />
                </body>
            </html>
        </ClerkProvider>
    );
}
