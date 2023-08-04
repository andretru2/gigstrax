import { type Metadata } from "next";
import { prisma } from "@/server/db";
import { env } from "@/env.mjs";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Manage Gig",
  description: "Manage your gig",
};

interface Props {
  params: {
    gigId: string;
  };
}

export default async function Page({ params }: Props) {
  const gigId = params.gigId;
  console.log("id", gigId);
  const data = await prisma.gig.findFirst({
    // select: {

    //   client: {
    //     select: {
    //       client: true,
    //     },
    //   },

    where: {
      id: gigId,
    },
  });
  return <h1>{JSON.stringify(data)}</h1>;
}
