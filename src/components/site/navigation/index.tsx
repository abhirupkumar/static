import { ModeToggle } from '@/components/global/mode-toggle'
import { UserButton } from '@clerk/nextjs'
import { User } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import localFont from "next/font/local";

type Props = {
  user?: null | User
}

const novaSquare = localFont({
  src: "../../../app/fonts/NovaSquare.ttf"
});

const Navigation = ({ user }: Props) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between backdrop-blur-lg">
      <aside className="flex items-center">
        <span className={`text-xl font-bold ${novaSquare.className}`}> Biznex</span>
      </aside>
      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex items-center justify-center gap-8">
          <Link className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:underline h-10 text-inherit p-0 underline-offset-8" href={'#'}>Pricing</Link>
          <Link className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:underline h-10 text-inherit p-0 underline-offset-8" href={'#'}>About</Link>
          <Link className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:underline h-10 text-inherit p-0 underline-offset-8" href={'#'}>Features</Link>
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
        <Link
          href={'/agency'}
          className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80"
        >
          Login
        </Link>
        <UserButton />
        <ModeToggle />
      </aside>
    </div>
  )
}

export default Navigation