/*
  Warnings:

  - The primary key for the `Gig` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `aG_SerialNumber` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `aG_StaffKey_Driver` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `aG_StaffKey_MrsSanta` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `aG_StaffKey_Santa` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_ContactEmail` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_ContactName` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_ContactPhoneCell` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_ContactPhoneLand` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_Date` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_InvoiceNumber` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_NotesGig` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_NotesVenue` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_Paid` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_Price` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_TimeEnd` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_TimeStart` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_Travel` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_VenueAddressCity` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_VenueAddressName` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_VenueAddressState` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_VenueAddressStreet` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_VenueAddressStreet2` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_VenueAddressZip` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_VenueType` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `bG_isSoftHold__s` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `filemakerId` on the `Gig` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Gig` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdBy` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeEnd` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeStart` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venueAddressCity` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venueAddressName` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venueAddressState` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venueAddressStreet` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venueType` to the `Gig` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TravelType" AS ENUM ('Self', 'PublicTransport');

-- AlterTable
ALTER TABLE "Gig" DROP CONSTRAINT "Gig_pkey",
DROP COLUMN "aG_SerialNumber",
DROP COLUMN "aG_StaffKey_Driver",
DROP COLUMN "aG_StaffKey_MrsSanta",
DROP COLUMN "aG_StaffKey_Santa",
DROP COLUMN "bG_ContactEmail",
DROP COLUMN "bG_ContactName",
DROP COLUMN "bG_ContactPhoneCell",
DROP COLUMN "bG_ContactPhoneLand",
DROP COLUMN "bG_Date",
DROP COLUMN "bG_InvoiceNumber",
DROP COLUMN "bG_NotesGig",
DROP COLUMN "bG_NotesVenue",
DROP COLUMN "bG_Paid",
DROP COLUMN "bG_Price",
DROP COLUMN "bG_TimeEnd",
DROP COLUMN "bG_TimeStart",
DROP COLUMN "bG_Travel",
DROP COLUMN "bG_VenueAddressCity",
DROP COLUMN "bG_VenueAddressName",
DROP COLUMN "bG_VenueAddressState",
DROP COLUMN "bG_VenueAddressStreet",
DROP COLUMN "bG_VenueAddressStreet2",
DROP COLUMN "bG_VenueAddressZip",
DROP COLUMN "bG_VenueType",
DROP COLUMN "bG_isSoftHold__s",
DROP COLUMN "filemakerId",
ADD COLUMN     "amountPaid" DECIMAL(10,2),
ADD COLUMN     "calendarId" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "contactPhoneCell" TEXT,
ADD COLUMN     "contactPhoneLand" TEXT,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "driverId" TEXT,
ADD COLUMN     "invoiceNumber" TEXT,
ADD COLUMN     "isSoftHold" BOOLEAN,
ADD COLUMN     "mrsSantaId" TEXT,
ADD COLUMN     "notesGig" TEXT,
ADD COLUMN     "notesVenue" TEXT,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "santaId" TEXT,
ADD COLUMN     "serial" INTEGER,
ADD COLUMN     "timeEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timeStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "travelType" TEXT,
ADD COLUMN     "updatedBy" TEXT NOT NULL,
ADD COLUMN     "venueAddressCity" TEXT NOT NULL,
ADD COLUMN     "venueAddressName" TEXT NOT NULL,
ADD COLUMN     "venueAddressState" TEXT NOT NULL,
ADD COLUMN     "venueAddressStreet" TEXT NOT NULL,
ADD COLUMN     "venueAddressStreet2" TEXT,
ADD COLUMN     "venueAddressZip" TEXT,
ADD COLUMN     "venueType" TEXT NOT NULL,
ALTER COLUMN "createdAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "nameFirst" TEXT NOT NULL,
    "nameLast" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "nameFirst" TEXT NOT NULL,
    "nameLast" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_id_key" ON "Client"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Gig_id_key" ON "Gig"("id");

-- AddForeignKey
ALTER TABLE "Gig" ADD CONSTRAINT "Gig_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gig" ADD CONSTRAINT "Gig_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gig" ADD CONSTRAINT "Gig_mrsSantaId_fkey" FOREIGN KEY ("mrsSantaId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gig" ADD CONSTRAINT "Gig_santaId_fkey" FOREIGN KEY ("santaId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;
