-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gig" (
    "id" TEXT NOT NULL,
    "filemakerId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "aG_SerialNumber" INTEGER NOT NULL,
    "aG_StaffKey_Driver" TEXT NOT NULL,
    "aG_StaffKey_MrsSanta" TEXT NOT NULL,
    "aG_StaffKey_Santa" TEXT NOT NULL,
    "bG_ContactEmail" TEXT NOT NULL,
    "bG_ContactName" TEXT NOT NULL,
    "bG_ContactPhoneCell" TEXT NOT NULL,
    "bG_ContactPhoneLand" TEXT NOT NULL,
    "bG_Date" TEXT NOT NULL,
    "bG_InvoiceNumber" TEXT NOT NULL,
    "bG_isSoftHold__s" BOOLEAN NOT NULL,
    "bG_NotesGig" TEXT NOT NULL,
    "bG_NotesVenue" TEXT NOT NULL,
    "bG_Paid" BOOLEAN NOT NULL,
    "bG_Price" INTEGER NOT NULL,
    "bG_TimeEnd" TIMESTAMP(3) NOT NULL,
    "bG_TimeStart" TIMESTAMP(3) NOT NULL,
    "bG_Travel" TEXT NOT NULL,
    "bG_VenueAddressCity" TEXT NOT NULL,
    "bG_VenueAddressName" TEXT NOT NULL,
    "bG_VenueAddressState" TEXT NOT NULL,
    "bG_VenueAddressStreet" TEXT NOT NULL,
    "bG_VenueAddressStreet2" TEXT NOT NULL,
    "bG_VenueAddressZip" TEXT NOT NULL,
    "bG_VenueType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

