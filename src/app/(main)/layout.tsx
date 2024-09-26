
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import React from 'react'
import { useTheme } from "next-themes";

const Layout = ({ children }: { children: React.ReactNode }) => {

    const { currentTheme } = useTheme();

    return (
        <ClerkProvider appearance={{
            baseTheme: currentTheme === "dark" ? dark : undefined
        }}>
            {children}
        </ClerkProvider>
    )
}

export default Layout;