import CustomClerkProvider from '@/components/clerk/CustomClerkProvider'
import Navigation from '@/components/site/navigation'
import localFont from 'next/font/local';
import React from 'react'

const novaSquare = localFont({
    src: "../fonts/NovaSquare.ttf"
});

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <CustomClerkProvider>
            <main className={`h-full ${novaSquare.className}`}>
                <Navigation />
                {children}
            </main>
        </CustomClerkProvider>
    )
}

export default layout
