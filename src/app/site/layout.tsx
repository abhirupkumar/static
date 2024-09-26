import Navigation from '@/components/site/navigation'
import React from 'react'
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const layout = ({ children }: { children: React.ReactNode }) => {
    const { currentTheme } = useTheme();
    return (
        <ClerkProvider appearance={{
            baseTheme: currentTheme === "dark" ? dark : undefined,
        }}>
            <main className="h-full">
                <Navigation />
                {children}
            </main>
        </ClerkProvider>
    )
}

export default layout
