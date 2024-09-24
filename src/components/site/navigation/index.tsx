import { ModeToggle } from '@/components/global/mode-toggle'
import { UserButton } from '@clerk/nextjs'
import { User } from '@clerk/nextjs/server'
import Link from 'next/link'
import React from 'react'
import localFont from "next/font/local";
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

type Props = {
  user?: null | User
}

const novaSquare = localFont({
  src: "../../../app/fonts/NovaSquare.ttf"
});

const Navigation = ({ user }: Props) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
      <aside className="flex items-center gap-2">
        <span className={`text-xl font-bold z-10 ${novaSquare.className}`}>Biznex</span>
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
        <Link href="/agency" className={cn(buttonVariants())}>
          Get Started
        </Link>
        <UserButton afterSignOutUrl="/" />
        <ModeToggle />
      </aside>
    </header>
  )
}

export default Navigation