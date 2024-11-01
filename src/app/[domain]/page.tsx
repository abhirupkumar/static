import React from "react";
import { notFound, redirect } from "next/navigation";
import { getDomainContent, updateSitePageVisits } from "@/lib/queries";
import EditorProvider from "@/providers/editor/editor-provider";
import SiteEditor from "../(main)/project/[projectId]/sites/editor/[sitePageId]/_components/site-editor";
import Head from "next/head";

interface DomainPageProps {
    params: {
        domain: string | undefined;
    };
}

const DomainPage: React.FC<DomainPageProps> = async ({ params }) => {
    const { domain } = params;

    if (!domain) notFound();

    const domainData = await getDomainContent(domain.slice(0, -1));

    if (!domainData) notFound();

    const pageData = domainData.SitePages.find((page) => !page.pathName);

    if (!pageData || !pageData.isPublished) notFound();

    await updateSitePageVisits(pageData.id);

    return (
        <>
            <Head >
                <link rel="icon" type="image/x-icon" href="https://cdn.iconscout.com/icon/free/png-256/free-a-icon-download-in-svg-png-gif-file-formats--button-blood-type-symbols-pack-sign-icons-37808.png?f=ico" />
            </Head>
            <EditorProvider
                projectId={domainData.projectId}
                pageDetails={pageData}
                siteId={domainData.id}
            >
                <SiteEditor
                    sitePageId={pageData.id}
                    sitePageData={pageData}
                    liveMode={true}
                />
            </EditorProvider>
        </>
    );
};

export async function generateMetadata({ params }: { params: { domain: string | undefined; }; }) {
    const { domain } = params;

    if (!domain) return;

    const domainData = await getDomainContent(domain.slice(0, -1));

    if (!domainData) return;

    const pageData = domainData.SitePages.find((page) => !page.pathName);

    if (!pageData || !pageData.isPublished) return;

    const title = (pageData.title && pageData.title != "") ? pageData.title : domainData.title
    const description = ((pageData.description && pageData.description != "") ? pageData.description : domainData.description) || ""
    const keywords = ((pageData.keywords && pageData.keywords != "") ? pageData.keywords.split(",") : domainData.title.split(",")) || ""
    return {
        title: title,
        description: description,
        keywords: keywords,
        openGraph: {
            title: title,
            description: description,
            siteName: domainData.title,
            icons: {
                icon: [
                    {
                        url: 'https://cdn.iconscout.com/icon/free/png-256/free-a-icon-download-in-svg-png-gif-file-formats--button-blood-type-symbols-pack-sign-icons-37808.png?f=ico',
                        href: 'https://cdn.iconscout.com/icon/free/png-256/free-a-icon-download-in-svg-png-gif-file-formats--button-blood-type-symbols-pack-sign-icons-37808.png?f=ico',
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
            },
            type: 'website',
            metadataBase: `https://${domainData.subDomainName}.zyper.vercel.app`,
        },
    }
}

export default DomainPage;