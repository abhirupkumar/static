import React from 'react'

import { Site, Project } from '@prisma/client'
import { db } from '@/lib/db'
import { getConnectAccountProducts } from '@/lib/stripe/stripe-actions'


import SiteForm from '@/components/forms/site-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import SiteProductsTable from './site-products-table'

interface SiteSettingsProps {
  projectId: string
  defaultData: Site
}

const SiteSettings: React.FC<SiteSettingsProps> = async ({
  projectId,
  defaultData,
}) => {
  //CHALLENGE: go connect your stripe to sell products

  const projectDetails = await db.project.findUnique({
    where: {
      id: projectId,
    },
  })

  if (!projectDetails) return
  if (!projectDetails.connectAccountId) return
  const products = await getConnectAccountProducts(
    projectDetails.connectAccountId
  )

  return (
    <div className="flex gap-4 flex-col xl:!flex-row">
      <Card className="flex-1 flex-shrink">
        <CardHeader>
          <CardTitle>Site Products</CardTitle>
          <CardDescription>
            Select the products and services you wish to sell on this site.
            You can sell one time and recurring products too.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <>
            {projectDetails.connectAccountId ? (
              <SiteProductsTable
                defaultData={defaultData}
                products={products}
              />
            ) : (
              'Connect your stripe account to sell products.'
            )}
          </>
        </CardContent>
      </Card>

      <SiteForm
        projectId={projectId}
        defaultData={defaultData}
      />
    </div>
  )
}

export default SiteSettings
