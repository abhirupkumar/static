import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/site', '/api/uploadthing'])

export default clerkMiddleware((auth, req) => {
    if (isPublicRoute(req)) {
        return NextResponse.next();
    }

    const url = req.nextUrl;
    const searchParams = url.searchParams.toString();
    const hostname = req.headers.get("host");
    const pathWithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""
        }`;

    // Extract subdomain if it exists
    const customSubDomain = hostname
        ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
        .filter(Boolean)[0];

    if (customSubDomain) {
        return NextResponse.rewrite(
            new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
        );
    }

    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
        console.log("signin")
        return NextResponse.redirect(new URL(`/workspace/sign-in`, req.url));
    }

    if (
        url.pathname === "/" ||
        (url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)
    ) {
        console.log("site")
        return NextResponse.rewrite(new URL("/site", req.url));
    }

    if (
        url.pathname.startsWith("/workspace") ||
        url.pathname.startsWith("/project")
    ) {
        return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
    }

    auth().protect()
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}