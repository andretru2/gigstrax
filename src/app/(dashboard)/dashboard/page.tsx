import { prisma } from "@/server/db";
// import Sources from "../lib/sources.json";
// import Clients from "../lib/clients.json";
// import Gigs from "../lib/gigs.json";
// import { parse } from "date-fns";

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

  if (false) {
    await prisma.source.deleteMany();

    // const formattedSources = Sources.map((source) => ({
    //   ...source,
    //   dob: parse(source.dob, "MM/dd/yyyy", new Date()).toISOString(),
    // }));

    const formattedSources = Sources.map((source) => ({
      ...source,
      dob: source.dob ? new Date(source.dob) : null,
      createdAt: source.createdAt ? new Date(source.createdAt) : null,
      updatedAt: source.updatedAt ? new Date(source.updatedAt) : null,
    }));

    // console.log(formattedSources);

    const res = await prisma.source.createMany({
      data: formattedSources,
    });
  }

  if (false) {
    // await prisma.gig.deleteMany();
    // await prisma.client.deleteMany();

    const formattedClients = Clients.map((client) => ({
      ...client,
      addressZip: client?.addressZip?.toString(),
      clientType:
        client?.clientType === "Event/Party Planner"
          ? "Event_Party_Planner"
          : client?.clientType === "agency"
          ? "Agency"
          : client?.clientType === "Country Club"
          ? "Country_Club"
          : client?.clientType === "fundraiser"
          ? "Fundraiser"
          : client?.clientType === "other"
          ? "Other"
          : client?.clientType,
      createdAt: client.createdAt ? new Date(client.createdAt) : null,
      updatedAt: client.updatedAt ? new Date(client.updatedAt) : null,
      notes: Buffer.from(client.notes, "binary").toString("utf8"),
    })).slice(200, 220);

    console.log(formattedClients);

    const res = await prisma.client.createMany({
      data: formattedClients,
    });
  }

  if (false) {
    // await prisma.gig.deleteMany();
    // await prisma.client.deleteMany();

    // await prisma.client.create({
    //   data: {
    //     id: "694E7E83-90F4-594D-8ED9-32E65F5A1268",
    //     addressCity: "New York",
    //     addressState: "NY",
    //     addressStreet: "725 Fifth Ave",
    //     addressZip: "10022",
    //     client: "Trump Organization",
    //     clientType: "Corporation",
    //     contact: "Diana Taddoni",
    //     email: "dtaddoni@trumporg.com",
    //     notes:
    //       "Joseph Quinto\riParty Pix\r80 Main Street\rFreehold, NJ 07728\rOff: 855-399-4749 (IPIX)                                                                                           \rCell: 973-710-6737\rwww.ipartypix.com\r\r ",
    //     phoneCell: "917-440-7185",
    //     phoneLandline: "212-715-7267",
    //     source: "iParty Pix",
    //     status: "",
    //     createdAt: new Date("11/27/2019 02:12:19"),
    //     createdBy: "JoeHark",
    //     updatedAt: new Date("09/21/2022 12:59:03"),
    //     updatedBy: "harkins.joe@gmail.com",
    //   },
    // });

    const formattedGigs = Gigs.map((gig, index) => {
      try {
        return {
          ...gig,
          venueAddressZip: gig?.venueAddressZip?.toString(),
          serial: parseInt(gig?.serial),
          venueType:
            gig?.venueType === "Event Space"
              ? "Event_Space"
              : gig?.venueType === "other"
              ? "Other"
              : gig?.venueType === "Photo Studio"
              ? "PhotoStudio"
              : gig?.venueType === "pre-school"
              ? "Preschool"
              : gig?.venueType === "Private Club"
              ? "PrivateClub"
              : gig?.venueType === "Public Space"
              ? "PublicSpace"
              : gig?.venueType === "TV Studio"
              ? "TV_Studio"
              : gig?.venueType,
          gigDate: gig.gigDate ? new Date(gig.gigDate) : null,
          timeStart:
            gig.gigDate && gig.timeStart
              ? new Date(`${gig.gigDate} ${gig.timeStart}`)
              : null,
          timeEnd:
            gig.gigDate && gig.timeEnd
              ? new Date(`${gig.gigDate} ${gig.timeEnd}`)
              : null,
          createdAt: gig.createdAt ? new Date(gig.createdAt) : null,
          updatedAt: gig.updatedAt ? new Date(gig.updatedAt) : null,
          notesVenue: Buffer.from(gig.notesVenue, "binary").toString("utf8"),
          notesGig: Buffer.from(gig.notesGig, "binary").toString("utf8"),
        };
      } catch (error) {
        console.error(`Error creating gig at row ${index + 1}:`, error);
        return null; // Skip the row
      }
    })
      .slice(350, 389)
      .filter(Boolean); // Remove any null/undefined values

    if (false) {
      const formattedGigs = Gigs.map((gig) => ({
        ...gig,
        venueAddressZip: gig?.venueAddressZip?.toString(),
        serial: parseInt(gig?.serial),
        venueType:
          gig?.venueType === "Event Space"
            ? "Event_Space"
            : gig?.venueType === "other"
            ? "Other"
            : gig?.venueType === "Photo Studio"
            ? "PhotoStudio"
            : gig?.venueType === "pre-school"
            ? "Preschool"
            : gig?.venueType === "Private Club"
            ? "PrivateClub"
            : gig?.venueType === "Public Space"
            ? "PublicSpace"
            : gig?.venueType === "TV Studio"
            ? "TV_Studio"
            : gig?.venueType,
        gigDate: gig.gigDate ? new Date(gig.gigDate) : null,
        timeStart:
          gig.gigDate && gig.timeStart
            ? new Date(`${gig.gigDate} ${gig.timeStart}`)
            : null,
        timeEnd:
          gig.gigDate && gig.timeEnd
            ? new Date(`${gig.gigDate} ${gig.timeEnd}`)
            : null,

        createdAt: gig.createdAt ? new Date(gig.createdAt) : null,
        updatedAt: gig.updatedAt ? new Date(gig.updatedAt) : null,
        notesVenue: Buffer.from(gig.notesVenue, "binary").toString("utf8"),
        notesGig: Buffer.from(gig.notesGig, "binary").toString("utf8"),
      })).slice(1, 100);
    }

    console.log(formattedGigs);

    const res = await prisma.gig.createMany({
      data: formattedGigs,
    });
  }

  // console.log(Sources);
  // console.log(res);

  const gigs = await prisma.gig.findMany({ take: 10 });
  // const clients = await prisma.client.findMany();
  // const sources = await prisma.source.findMany();
  // console.log(clients.length);

  return (
    <h1 className="text-4xl ">
      Welcome back, Andres
      {/* {JSON.stringify(gigs)} */}
      {/* {JSON.stringify(clients)} */}
      {/* {JSON.stringify(sources)} */}
    </h1>
  );
}
