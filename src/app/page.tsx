import { prisma } from "@/server/db";

export default async function prismaExample() {
  if (false) {
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

  if (true) {
    const res = await prisma.source.create({
      data: {
        id: "EDA3FF75-2A87-4A81-BEFD-A20F18D4DAF4",
        addressCity: "Jersey City",
        addressState: "NJ",
        addressStreet: "2595 John F Kennedy Bld (E-46)",
        addressZip: "07306",
        bS_Costume: "",
        bS_DOB: "03/30/1933",
        bS_Driver: "",
        bS_Email: "harkins.joe@gmail.com",
        bS_Entity: "",
        bS_Gender: "M",
        bS_GigMastersAccount: "GM #138885 joe@realbeardsantajoe.com",
        bS_GoogleCalendarID:
          "s1ut4hq3qr3is27pm6jbn4je9c@group.calendar.google.com",
        bS_NameFirst: "Joe",
        bS_NameLast: "Harkins",
        bS_Notes: "prospect 2021",
        bS_Phone: "201-238-3343",
        bS_Resource: "",
        bS_Role: "RBS Joe",
        bS_SSN: "110-24-2230",
        bS_Santa: "",
        bS_Status: "Active",
        bS_User_Password: "",
        bS_Username: "",
        bS_Video: "",
        bS_Website: "RealBeardSantaJoe.com",
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

  return (
    <div>
      {JSON.stringify(gigs)}
      {JSON.stringify(clients)}
    </div>
  );
}
