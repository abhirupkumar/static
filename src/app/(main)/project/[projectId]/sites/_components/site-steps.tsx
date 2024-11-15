'use client'
import CreateSitePage from '@/components/forms/site-page'
import CustomModal from '@/components/global/custom-modal'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/components/ui/use-toast'
import { upsertSitePage } from '@/lib/queries'
import { SitesForProject } from '@/lib/types'
import { useModal } from '@/providers/modal-provider'
import { SitePage } from '@prisma/client'
import { Check, ExternalLink, LucideEdit } from 'lucide-react'
import React, { useState } from 'react'

import {
  DragDropContext,
  DragStart,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd'
import Link from 'next/link'
import SitePagePlaceholder from '@/components/icons/site-page-placeholder'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import SiteStepCard from './site-step-card'

type Props = {
  site: SitesForProject
  projectId: string
  pages: SitePage[]
  siteId: string
}

const SiteSteps = ({ site, siteId, pages, projectId }: Props) => {
  const [clickedPage, setClickedPage] = useState<SitePage | undefined>(
    pages[0]
  )
  const { setOpen } = useModal()
  const [pagesState, setPagesState] = useState(pages)
  const onDragStart = (event: DragStart) => {
    //current chosen page
    const { draggableId } = event
    const value = pagesState.find((page) => page.id === draggableId)
  }

  const onDragEnd = (dropResult: DropResult) => {
    const { destination, source } = dropResult

    //no destination or same position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return
    }
    //change state
    const newPageOrder = [...pagesState]
      .toSpliced(source.index, 1)
      .toSpliced(destination.index, 0, pagesState[source.index])
      .map((page, idx) => {
        return { ...page, order: idx }
      })

    setPagesState(newPageOrder)
    newPageOrder.forEach(async (page, index) => {
      try {
        await upsertSitePage(
          projectId,
          {
            id: page.id,
            order: index,
            name: page.name,
          },
          siteId
        )
      } catch (error) {
        console.log(error)
        toast({
          variant: 'destructive',
          title: 'Failed',
          description: 'Could not save page order',
        })
        return
      }
    })

    toast({
      title: 'Success',
      description: 'Saved page order',
    })
  }

  return (
    <AlertDialog>
      <div className="flex border-[1px] lg:!flex-row flex-col ">
        <aside className="flex-[0.3] bg-background p-6  flex flex-col justify-between ">
          <ScrollArea className="h-full ">
            <div className="flex gap-4 items-center">
              <Check />
              Site Steps
            </div>
            {pagesState.length ? (
              <DragDropContext
                onDragEnd={onDragEnd}
                onDragStart={onDragStart}
              >
                <Droppable
                  droppableId="sites"
                  direction="vertical"
                  key="sites"
                >
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {pagesState.map((page, idx) => (
                        <div
                          className="relative"
                          key={page.id}
                          onClick={() => setClickedPage(page)}
                        >
                          <SiteStepCard
                            sitePage={page}
                            index={idx}
                            key={page.id}
                            activePage={page.id === clickedPage?.id}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="text-center text-muted-foreground py-6">
                No Pages
              </div>
            )}
          </ScrollArea>
          <Button
            className="mt-4 w-full"
            onClick={() => {
              setOpen(
                <CustomModal
                  title=" Create or Update a Site Page"
                  subheading="Site Pages allow you to create step by step processes for customers to follow"
                >
                  <CreateSitePage
                    projectId={projectId}
                    siteId={siteId}
                    order={pagesState.length}
                  />
                </CustomModal>
              )
            }}
          >
            Create New Steps
          </Button>
        </aside>
        <aside className="flex-[0.7] bg-muted p-4 ">
          {!!pages.length ? (
            <Card className="h-full flex justify-between flex-col">
              <CardHeader>
                <p className="text-sm text-muted-foreground">Page name</p>
                <CardTitle>{clickedPage?.name}</CardTitle>
                <CardDescription className="flex flex-col gap-4">
                  <div className="border-2 rounded-lg sm:w-80 w-full  overflow-clip">
                    <Link
                      href={`/project/${projectId}/sites/editor/${clickedPage?.id}`}
                      className="relative group"
                    >
                      <div className="cursor-pointer group-hover:opacity-30 w-full">
                        <SitePagePlaceholder />
                      </div>
                      <LucideEdit
                        size={50}
                        className="!text-muted-foreground absolute top-1/2 left-1/2 opacity-0 transofrm -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 transition-all duration-100"
                      />
                    </Link>

                    <Link
                      target="_blank"
                      href={`${process.env.NEXT_PUBLIC_URL}${site?.subDomainName}/${clickedPage?.pathName}`}
                      className="group flex items-center justify-start p-2 gap-2 hover:text-primary transition-colors duration-200"
                    >
                      <ExternalLink size={15} />
                      <div className="w-64 overflow-hidden overflow-ellipsis ">
                        {process.env.NEXT_PUBLIC_URL}{site?.subDomainName}/{clickedPage?.pathName}
                      </div>
                    </Link>
                  </div>

                  <CreateSitePage
                    projectId={projectId}
                    defaultData={clickedPage}
                    siteId={siteId}
                    order={clickedPage?.order || 0}
                  />
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="h-[600px] flex items-center justify-center text-muted-foreground">
              Create a page to view page settings.
            </div>
          )}
        </aside>
      </div>
    </AlertDialog>
  )
}

export default SiteSteps
