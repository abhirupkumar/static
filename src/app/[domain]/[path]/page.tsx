import React from "react";
import { notFound } from "next/navigation";
import { getDomainContent } from "@/lib/queries";
import EditorProvider from "@/providers/editor/editor-provider";
import SiteEditor from "@/app/(main)/project/[projectId]/sites/editor/[sitePageId]/_components/site-editor";

interface DomainPathPageProps {
    params: {
        domain: string | undefined;
        path: string | undefined;
    };
}

const DomainPathPage: React.FC<DomainPathPageProps> = async ({ params }) => {
    const { domain, path } = params;

    if (!domain || !path) notFound();

    const domainData = await getDomainContent(domain.slice(0, -1));
    const pageData = domainData?.SitePages.find(
        (page) => page.pathName === params.path
    );

    if (!pageData || !domainData || !pageData.isPublished) notFound();

    return (
        <EditorProvider
            projectId={domainData.projectId}
            pageDetails={pageData}
            siteId={domainData.id}
        >
            <SiteEditor
                sitePageData={pageData}
                sitePageId={pageData.id}
                liveMode={true}
            />
        </EditorProvider>
    );
};

export default DomainPathPage;