import CustomClerkProvider from "@/components/clerk/CustomClerkProvider";
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {

    return (
        <CustomClerkProvider>
            {children}
        </CustomClerkProvider>
    )
}

export default Layout;