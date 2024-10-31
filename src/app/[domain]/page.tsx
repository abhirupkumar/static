import React from "react";
import { notFound, redirect } from "next/navigation";
import { getDomainContent, updateSitePageVisits } from "@/lib/queries";
import EditorProvider from "@/providers/editor/editor-provider";
import SiteEditor from "../(main)/project/[projectId]/sites/editor/[sitePageId]/_components/site-editor";

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
    );
};

export default DomainPage;