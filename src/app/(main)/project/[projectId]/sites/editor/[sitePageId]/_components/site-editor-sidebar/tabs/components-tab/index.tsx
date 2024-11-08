import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { EditorBtns } from '@/lib/constants'
import React from 'react'
import TextPlaceholder from './text-placeholder'
import ContainerPlaceholder from './container-placeholder'
import VideoPlaceholder from './video-placeholder'
import TwoColumnsPlaceholder from './two-columns-placeholder'
import LinkPlaceholder from './link-placeholder'
import ContactFormComponentPlaceholder from './contact-form-placeholder'
import ThreeColumnsPlaceholder from './three-columns-placeholder'
import ImagePlaceholder from './image-placeholder'
import HeadingPlaceholder from './heading-placeholder'
import ParagraphPlaceholder from './paragraph-placeholder'

type Props = {}

const ComponentsTab = (props: Props) => {
  const elements: {
    Component: React.ReactNode
    label: string
    id: EditorBtns
    group: 'layout' | 'elements' | 'components'
  }[] = [
      {
        Component: <TextPlaceholder />,
        label: 'Text',
        id: 'text',
        group: 'elements',
      },
      {
        Component: <HeadingPlaceholder />,
        label: 'Heading',
        id: 'heading',
        group: 'elements',
      },
      {
        Component: <ParagraphPlaceholder />,
        label: 'Paragraph',
        id: 'paragraph',
        group: 'elements',
      },
      {
        Component: <ContainerPlaceholder />,
        label: 'Container',
        id: 'container',
        group: 'layout',
      },
      {
        Component: <TwoColumnsPlaceholder />,
        label: '2 Columns',
        id: '2Col',
        group: 'layout',
      },
      {
        Component: <ThreeColumnsPlaceholder />,
        label: '3 Columns',
        id: '3Col',
        group: 'layout',
      },
      {
        Component: <LinkPlaceholder />,
        label: 'Link',
        id: 'link',
        group: 'elements',
      },
      {
        Component: <ImagePlaceholder />,
        label: 'Image',
        id: 'image',
        group: 'elements',
      },
      {
        Component: <VideoPlaceholder />,
        label: 'Video',
        id: 'video',
        group: 'elements',
      },
      {
        Component: <ContactFormComponentPlaceholder />,
        label: 'Contact',
        id: 'contactForm',
        group: 'components',
      },
    ]

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={['Layout', 'Elements', 'Components']}
    >
      <AccordionItem
        value="Layout"
        className="px-6 py-0 border-y-[1px]"
      >
        <AccordionTrigger className="!no-underline">Layout</AccordionTrigger>
        <AccordionContent className="flex flex-wrap gap-2 ">
          {elements
            .filter((element) => element.group === 'layout')
            .map((element) => (
              <div
                key={element.id}
                className="flex-col items-center justify-center flex"
              >
                {element.Component}
                <span className="text-muted-foreground">{element.label}</span>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="Elements"
        className="px-6 py-0 "
      >
        <AccordionTrigger className="!no-underline">Elements</AccordionTrigger>
        <AccordionContent className="flex flex-wrap gap-2 ">
          {elements
            .filter((element) => element.group === 'elements')
            .map((element) => (
              <div
                key={element.id}
                className="flex-col items-center justify-center flex"
              >
                {element.Component}
                <span className="text-muted-foreground">{element.label}</span>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="Components"
        className="px-6 py-0 "
      >
        <AccordionTrigger className="!no-underline">Components</AccordionTrigger>
        <AccordionContent className="flex flex-wrap gap-2 ">
          {elements
            .filter((element) => element.group === 'components')
            .map((element) => (
              <div
                key={element.id}
                className="flex-col items-center justify-center flex"
              >
                {element.Component}
                <span className="text-muted-foreground">{element.label}</span>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default ComponentsTab
