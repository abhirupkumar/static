import React from 'react'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Component, Database, Layers3, PaintRoller, SettingsIcon } from 'lucide-react'

type Props = {}

const TabList = (props: Props) => {
  return (
    <TabsList className=" flex items-center flex-col justify-evenly w-full bg-transparent h-fit gap-4 ">
      <TabsTrigger
        value="Styles"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <PaintRoller />
      </TabsTrigger>
      <TabsTrigger
        value="Settings"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <SettingsIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Components"
        className="data-[state=active]:bg-muted w-10 h-10 p-0"
      >
        <Component className='rotate-45' />
      </TabsTrigger>
      <TabsTrigger
        value="Media"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <Database />
      </TabsTrigger>
      <TabsTrigger
        value="Layers"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <Layers3 />
      </TabsTrigger>
    </TabsList>
  )
}

export default TabList