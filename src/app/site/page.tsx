import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { pricingCards } from '@/lib/constants'
// import { stripe } from '@/lib/stripe'
import clsx from 'clsx'
import { Check } from 'lucide-react'
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BackgroundBeams } from '@/components/modules/BackgroundBeams'
import { HeroContainerScroll } from '@/components/modules/HeroContainerScroll'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import { StickyScroll } from '@/components/modules/StickyScrollReveal'

export default async function Home() {

  return (
    <div className='h-full'>
      <section className="w-full relative">
        <MaxWidthWrapper>
          <HeroContainerScroll />
        </MaxWidthWrapper>
        <BackgroundBeams />
      </section>
      <section className="w-full mt-10 md:mt-20">
        <MaxWidthWrapper>
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-4xl text-center font-medium">
              Explore new features
            </h2>
            <div className="text-muted-foreground text-center">
              <p>
                Static does everything possible to provide you with a convenient
                tool for managing your workspace.
              </p>
              <p>Here are just a few tools that may interest you.</p>
            </div>
          </div>
        </MaxWidthWrapper>
        <div className="py-10">
          <StickyScroll />
        </div>
      </section>
      <div className="h-[40rem] w-full rounded-md relative flex flex-col items-center justify-center antialiased">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b dark:from-neutral-200 dark:to-neutral-400 from-neutral-400 to-neutral-600  text-center font-sans font-bold">
            Join Static
          </h1>
          <p></p>
          <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
            Discover the power of seamless workspace management with Static Workspace. Experience the difference today and revolutionize the way you
            manage your workspace with Static.
          </p>
          <div className="flex justify-center mt-8">
            <Link
              href="/workspace"
              className={cn(buttonVariants({ variant: "secondary" }), "w-20")}
            >
              Join
            </Link>
          </div>
        </div>
        <BackgroundBeams />
      </div>
    </div>
  )
}