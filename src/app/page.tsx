import { prisma } from "@/server/db";

export default async function prismaExample() {
  const res = await prisma.gig.create({
    data: {
      clientId: "3BF2865E-F8AF-4F1A-B0CE-BF0893770C2C",
      calendarId: "2uqlrntsqapbrk3pm5ab505hu8",
      driverId: "",
      mrsSantaId: "",
      santaId: "EDA3FF75-2A87-4A81-BEFD-A20F18D4DAF4",
      id: "A97D5835-46A4-48A2-A3B5-BEE5D4FE5705",
      contactEmail: "Alachildcare@yahoo.com ",
      contactName: "Olga Regal",
      contactPhoneCell: "862-596-9498",
      contactPhoneLand: "",
      date: new Date("2018-08-10 10:37:44"),
      invoiceNumber: "",
      notesGig: "sent second email 11/9",
      notesVenue: "Also in Kearney 201-991-8855 (franchise? same owner?)",
      amountPaid: 650,
      price: 650,
      timeEnd: new Date("2018-08-10 13:00:00"),
      timeStart: new Date("2018-08-10 10:00:00"),
      travelType: "",
      venueAddressCity: "Clifton",
      venueAddressName: "A Learning Adventure Childcare",
      venueAddressState: "NJ",
      venueAddressStreet: "",
      venueAddressStreet2: "",
      venueAddressZip: "0o7030",
      venueType: "Office",
      isSoftHold: null,
      createdAt: null,
      createdBy: "",
      updatedAt: new Date("2021-10-28 10:37:44"),
      updatedBy: "harkins.joe@gmail.com",
    },
  });
  console.log(res);

  const gigs = await prisma.gig.findMany();

  return <div>{JSON.stringify(gigs)}</div>;
}
