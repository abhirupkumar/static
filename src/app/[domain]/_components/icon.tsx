import { getDomainContent } from '@/lib/queries';
import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

export const contentType = 'image/ico'

// Image generation
export default async function Icon({ params }: { params: { domain: string | undefined; } }) {
    const { domain } = params;

    if (!domain) return;

    const domainData = await getDomainContent(domain.slice(0, -1));

    if (!domainData) return;

    const pageData = domainData.SitePages.find((page) => !page.pathName);

    if (!pageData || !pageData.isPublished) return;
    return (
        <img src={domainData.favicon || pageData.previewImage || ""} alt="Icon" className="w-full h-full" />
    )
}