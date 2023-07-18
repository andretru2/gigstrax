
import DataTable from "@/components/gig/data-table"

import { type Metadata } from "next"
import { prisma } from "@/server/db";


export const metadata: Metadata = {
  title: "Gigs",
  description: "Manage your gigs",
}

// interface Props {
//   params: {
//     storeId: string
//   }
//   searchParams: {
//     [key: string]: string | string[] | undefined
//   }
// }

async function getGigs() {
    const data = await prisma.gig.findMany({take: 10})  
    return data
      
    
}

export default async function Page() {
    const data = await getGigs()

    console.log("data", data)

    return(
        <DataTable data={data} pageCount={10} />
    )
}