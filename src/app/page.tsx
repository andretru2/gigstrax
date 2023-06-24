import { prisma } from "@/server/db";

export default async function prismaExample() {
  if (true) {
    const res = await prisma.gig.create({
      data: {
        clientId: "A4370F67-BCF6-457A-BDCB-F91E4CC4FA44",
        calendarId: "dlj9kfv9d3q4g1botuo5man7ic",
        driverId: null,
        mrsSantaId: null,
        santaId: "EDA3FF75-2A87-4A81-BEFD-A20F18D4DAF4",
        id: "B133B7F9-1AC8-4F4B-AE5D-1B54B7D1576C",
        contactEmail: "briangreene@northsouth.tv",
        contactName: "Brian Greene, AD",
        contactPhoneCell: "917-686-5392",
        contactPhoneLand: "",
        date: new Date("10/12/2018"),
        invoiceNumber: "",
        notesGig: "",
        notesVenue: "",
        amountPaid: 0,
        price: 0,
        timeEnd: new Date("10/12/2018 18:00:00"),
        timeStart: new Date("10/12/2018 12:00:00"),
        travelType: "",
        venueAddressCity: "Staten Island",
        venueAddressName: "St George Theater",
        venueAddressState: "NY",
        venueAddressStreet: "35 Hyatt St",
        venueAddressStreet2: "",
        venueAddressZip: "10301",
        venueType: "",
        isSoftHold: null,
        createdAt: null,
        createdBy: "",
        updatedAt: new Date("10/17/2019 16:45:50"),
        updatedBy: "andretru2",
      },
    });
  }

  if (false) {
    const res = await prisma.source.create({
      data: {
        id: "EDA3FF75-2A87-4A81-BEFD-A20F18D4DAF4",
        addressCity: "Jersey City",
        addressState: "NJ",
        addressStreet: "2595 John F Kennedy Bld (E-46)",
        addressZip: "07306",
        costume: "",
        dob: new Date("03/30/1933"),
        email: "harkins.joe@gmail.com",
        entity: "",
        gender: "M",
        gigMastersAccount: "GM #138885 joe@realbeardsantajoe.com",
        calendarId: "s1ut4hq3qr3is27pm6jbn4je9c@group.calendar.google.com",
        nameFirst: "Joe",
        nameLast: "Harkins",
        notes: "prospect 2021",
        phone: "201-238-3343",
        resource: "",
        role: "RBS Joe",
        ssn: "110-24-2230",

        status: "Active",

        videoUrl: "",
        website: "RealBeardSantaJoe.com",
      },
    });
  }

  if (false) {
    const res = await prisma.client.create({
      data: {
        id: "A4370F67-BCF6-457A-BDCB-F91E4CC4FA44",
        addressCity: "Staten Island",
        addressState: "NY",
        addressStreet: "35 Hyatt St",
        addressZip: "10301",
        client: "Jokers",
        clientType: null,
        contact: "",
        email: "briangreene@northsouth.tv",
        notes: "",
        phoneCell: "917-686-5392",
        phoneLandline: "",
        source: "",
        status: "",
      },
    });
  }

  // console.log(res);

  const gigs = await prisma.gig.findMany();
  const clients = await prisma.client.findMany();
  const sources = await prisma.source.findMany();

  return (
    <div>
      {JSON.stringify(gigs)}
      {JSON.stringify(clients)}
      {JSON.stringify(sources)}
    </div>
  );
}
