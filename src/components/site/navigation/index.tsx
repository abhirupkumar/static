import { ModeToggle } from '@/components/global/mode-toggle'
import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import React from 'react'
import localFont from "next/font/local";
import { cn, constructMetadata } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import Image from 'next/image'

const novaSquare = localFont({
  src: "../../../app/fonts/NovaSquare.ttf"
});

const Navigation = async () => {
  const user = await currentUser();
  return (
    <header className="p-4 flex items-center justify-between backdrop-blur-sm relative">
      <aside className="flex items-center gap-x-2">
        <Image src="/assets/logo.png" width={45} height={45} alt="Static Logo" />
        <span className={`text-xl font-bold z-10 ${novaSquare.className}`}>Static.</span>
      </aside>
      <nav className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <ul className="flex items-center gap-8">
          <li>
            <Link
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-inherit p-0 underline-offset-8"
              )}
              href="#"
            >
              Pricing
            </Link>
          </li>
          <li>
            <Link
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-inherit p-0 underline-offset-8"
              )}
              href="#"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-inherit p-0 underline-offset-8"
              )}
              href="#"
            >
              Features
            </Link>
          </li>
        </ul>
      </nav>
      <aside className="flex items-center gap-2">
        <Link href="/workspace" className={cn(buttonVariants())}>
          {user ? "Dashboard" : "Get Started"}
        </Link>
        {user && <UserButton />}
        <ModeToggle />
      </aside>
    </header>
  )
}

export default Navigation

export const metadata = constructMetadata({
  title: "Static - No Code Website Builder",
  description: "Static - Create Stunning Websites Without Writing Code",
  image: "/assets/logo.png",
});