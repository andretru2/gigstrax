import { prisma } from "@/server/db";

export default async function prismaExample() {
  const res = await prisma.user.create({
    data: {
      name: "Elliott",
      email: "at@example-user.com",
    },
  });
  console.log(res);

  const users = await prisma.user.findMany();

  return <div>{JSON.stringify(users)}</div>;
}
