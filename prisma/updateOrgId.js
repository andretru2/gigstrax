import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ORG_ID = "clyxg38fm0000o37d2j4ut2yt";

async function updateRecordsWithOrgId() {
  const models = ["Gig", "Client", "Source"];

  for (const model of models) {
    try {
      // @ts-ignore: Prisma doesn't have a type-safe way to dynamically access models
      const result = await prisma[model].updateMany({
        where: {
          orgId: null, // Only update records that don't have an orgId
        },
        data: {
          orgId: ORG_ID,
        },
      });

      console.log(`Updated ${result.count} records in ${model}`);
    } catch (error) {
      console.error(`Error updating ${model}:`, error);
    }
  }
}

async function main() {
  try {
    await updateRecordsWithOrgId();
    console.log("All records updated successfully");
  } catch (error) {
    console.error("Error in main execution:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
