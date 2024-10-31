import { getDomainContent } from '@/lib/queries';
import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

export const contentType = 'image/png'

// Image generation
export default async function Icon({ params }: { params: { domain: string | undefined; } }) {

    return (
        <img src={"/assets/logo.png"} alt="Icon" className="w-full h-full" />
    )
}