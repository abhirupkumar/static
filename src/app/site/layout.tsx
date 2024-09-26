import CustomClerkProvider from '@/components/clerk/CustomClerkProvider'
import Navigation from '@/components/site/navigation'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <CustomClerkProvider>
            <main className="h-full">
                <Navigation />
                {children}
            </main>
        </CustomClerkProvider>
    )
}

export default layout
