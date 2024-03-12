// "use client";
import { prisma } from "@/server/db";
// import Sources from "../lib/sources.json";
// import Clients from "../lib/clients.json";
// import Gigs from "../../../lib/fmData/gigs.json";
import GigsTimeFix from "../../../lib/fmData/gigs-timefix.json";
// import Clients from "../../../lib/fmData/clients.json";
// import Sources from "../../../lib/fmData/sources.json";
// import { parse } from "date-fns";
import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { type Gender } from "@prisma/client";
import { getGigs, update } from "@/app/_actions/gig";
// import { useSession } from "next-auth/react";

export default async function Page() {
  // const { data } = useSession();
  // return (
  //   <>Hello {data?.user?.name}. Dashboard will be developed on next phase. </>
  // );

  if (false) {
    GigsTimeFix.map(async (gig) => {
      const res = await prisma.gig.update({
        where: {
          id: gig.id,
        },
        data: {
          gigDate: new Date(gig.gigDate),
          timeStart: new Date(gig.timeStart),
          timeEnd: new Date(gig.timeEnd),
          createdAt: new Date(gig.createdAt),
          // updatedAt: new Date(gig.updatedAt),
        },
      });
      console.log(res);
    });
  }

  if (false) {
    const today = new Date();
    const { data } = await getGigs({
      select: {
        id: true,
        timeStart: true,
        timeEnd: true,
        gigDate: true,
      },
      whereClause: {
        gigDate: { gte: today },
        id: "F1CEB335-1106-254C-ABCE-95C6F7A51431",
      },
      limit: 100,
    });
    console.log(data);

    // Add 5 hours to each timeStart and timeEnd
    const gigsUpcomingUpdatedTime = data.map((gig) => {
      let updatedStart = null;
      let updatedEnd = null;

      if (!gig.gigDate || !gig.timeStart || !gig.timeEnd) return gig;

      const gigDate = new Date(gig.gigDate);

      const gigYear = gigDate.getFullYear();
      const gigMonth = gigDate.getMonth();
      const gigDay = gigDate.getDate();

      updatedStart = new Date(gigYear, gigMonth, gigDay);
      updatedStart.setHours(
        gig.timeStart.getHours(),
        gig.timeStart.getMinutes(),
      );

      // Initialize Date object with those parts
      updatedEnd = new Date(gigYear, gigMonth, gigDay);
      updatedEnd.setHours(gig.timeEnd.getHours(), gig.timeEnd.getMinutes());

      // const res = update({
      //   id: gig.id,
      //   timeStart: updatedStart,
      //   timeEnd: updatedEnd,
      // });

      // console.log(res);

      return {
        ...gig,
        timeStart: updatedStart ?? null,
        timeEnd: updatedEnd ?? null,
      };
    });

    console.log(gigsUpcomingUpdatedTime);

    if (gigsUpcomingUpdatedTime.length) return;
    // Update gigs with new timeStart and timeEnd

    const res = await prisma.gig.updateMany({
      data: gigsUpcomingUpdatedTime,
    });

    // const res = await update({
    //   id: gigsUpcomingUpdatedTime[0].id,
    //   timeStart: gigsUpcomingUpdatedTime[0].timeStart,
    //   timeEnd: gigsUpcomingUpdatedTime[0].timeEnd,
    // });

    console.log(res);
  }

  //if (false) {
  //   const res = await prisma.gig.create({
  //     data: {
  //       clientId: "A4370F67-BCF6-457A-BDCB-F91E4CC4FA44",
  //       calendarId: "dlj9kfv9d3q4g1botuo5man7ic",
  //       driverId: null,
  //       mrsSantaId: null,
  //       santaId: "EDA3FF75-2A87-4A81-BEFD-A20F18D4DAF4",
  //       id: "B133B7F9-1AC8-4F4B-AE5D-1B54B7D1576C",
  //       contactEmail: "briangreene@northsouth.tv",
  //       contactName: "Brian Greene, AD",
  //       contactPhoneCell: "917-686-5392",
  //       contactPhoneLand: "",
  //       date: new Date("10/12/2018"),
  //       invoiceNumber: "",
  //       notesGig: "",
  //       notesVenue: "",
  //       amountPaid: 0,
  //       price: 0,
  //       timeEnd: new Date("10/12/2018 18:00:00"),
  //       timeStart: new Date("10/12/2018 12:00:00"),
  //       travelType: "",
  //       venueAddressCity: "Staten Island",
  //       venueAddressName: "St George Theater",
  //       venueAddressState: "NY",
  //       venueAddressStreet: "35 Hyatt St",
  //       venueAddressStreet2: "",
  //       venueAddressZip: "10301",
  //       venueType: "",
  //       isSoftHold: null,
  //       createdAt: null,
  //       createdBy: "",
  //       updatedAt: new Date("10/17/2019 16:45:50"),
  //       updatedBy: "andretru2",
  //     },
  //   });
  // }

  // if (false) {
  //   const formattedSources = Sources.map((source) => ({
  //     ...source,
  //     dob: source.dob ? new Date(source.dob) : null,
  //     createdAt: source.createdAt ? new Date(source.createdAt) : null,
  //     updatedAt: source.updatedAt ? new Date(source.updatedAt) : null,
  //     gender: source.gender == null ? null : (source.gender as Gender),
  //   }));

  //   // console.log(formattedSources);

  //   const res = await prisma.source.createMany({
  //     data: formattedSources,
  //   });

  //   console.log(res);
  // }

  // const res = await prisma.source.create({
  //   data: Sources,
  // });
  // console.log(res);

  // if (false) {
  //   const res = await prisma.client.create({
  //     data: {
  //       id: "A4370F67-BCF6-457A-BDCB-F91E4CC4FA44",
  //       addressCity: "Staten Island",
  //       addressState: "NY",
  //       addressStreet: "35 Hyatt St",
  //       addressZip: "10301",
  //       client: "Jokers",
  //       clientType: null,
  //       contact: "",
  //       email: "briangreene@northsouth.tv",
  //       notes: "",
  //       phoneCell: "917-686-5392",
  //       phoneLandline: "",
  //       source: "",
  //       status: "",
  //     },
  //   });
  // }

  // if (false) {
  //   await prisma.source.deleteMany();

  //   // const formattedSources = Sources.map((source) => ({
  //   //   ...source,
  //   //   dob: parse(source.dob, "MM/dd/yyyy", new Date()).toISOString(),
  //   // }));

  //   const formattedSources = Sources.map((source) => ({
  //     ...source,
  //     dob: source.dob ? new Date(source.dob) : null,
  //     createdAt: source.createdAt ? new Date(source.createdAt) : null,
  //     updatedAt: source.updatedAt ? new Date(source.updatedAt) : null,
  //   }));

  //   // console.log(formattedSources);

  //   const res = await prisma.source.createMany({
  //     data: formattedSources,
  //   });
  // }

  // if (false) {
  // await prisma.gig.deleteMany();
  // await prisma.client.deleteMany();

  //   console.log(Clients[0]);

  //   const formattedClients = Clients.map((client) => ({
  //     ...client,
  //     addressZip: client?.addressZip?.toString(),
  //     clientType:
  //       client?.clientType === "Event/Party Planner"
  //         ? "Event_Party_Planner"
  //         : client?.clientType === "agency"
  //         ? "Agency"
  //         : client?.clientType === "Country Club"
  //         ? "Country_Club"
  //         : client?.clientType === "fundraiser"
  //         ? "Fundraiser"
  //         : client?.clientType === "other"
  //         ? "Other"
  //         : client?.clientType,
  //     createdAt: client.createdAt ? new Date(client.createdAt) : null,
  //     updatedAt: client.updatedAt ? new Date(client.updatedAt) : null,
  //     notes: Buffer.from(client.notes, "binary").toString("utf8"),
  //   })).slice(5, 10);

  //   console.log(formattedClients);

  //   const res = await prisma.client.createMany({
  //     data: formattedClients,
  //   });
  // }

  // if (false) {
  //   // await prisma.gig.deleteMany();
  //   // await prisma.client.deleteMany();

  //   // await prisma.client.create({
  //   //   data: {
  //   //     id: "694E7E83-90F4-594D-8ED9-32E65F5A1268",
  //   //     addressCity: "New York",
  //   //     addressState: "NY",
  //   //     addressStreet: "725 Fifth Ave",
  //   //     addressZip: "10022",
  //   //     client: "Trump Organization",
  //   //     clientType: "Corporation",
  //   //     contact: "Diana Taddoni",
  //   //     email: "dtaddoni@trumporg.com",
  //   //     notes:
  //   //       "Joseph Quinto\riParty Pix\r80 Main Street\rFreehold, NJ 07728\rOff: 855-399-4749 (IPIX)                                                                                           \rCell: 973-710-6737\rwww.ipartypix.com\r\r ",
  //   //     phoneCell: "917-440-7185",
  //   //     phoneLandline: "212-715-7267",
  //   //     source: "iParty Pix",
  //   //     status: "",
  //   //     createdAt: new Date("11/27/2019 02:12:19"),
  //   //     createdBy: "JoeHark",
  //   //     updatedAt: new Date("09/21/2022 12:59:03"),
  //   //     updatedBy: "harkins.joe@gmail.com",
  //   //   },
  //   // });

  //   const formattedGigs = Gigs.map((gig, index) => {
  //     try {
  //       return {
  //         ...gig,
  //         venueAddressZip: gig?.venueAddressZip?.toString(),
  //         serial: parseInt(gig?.serial),
  //         venueType:
  //           gig?.venueType === "Event Space"
  //             ? "Event_Space"
  //             : gig?.venueType === "other"
  //             ? "Other"
  //             : gig?.venueType === "Retail Space"
  //             ? "Retail_Space"
  //             : gig?.venueType === "Photo Studio"
  //             ? "PhotoStudio"
  //             : gig?.venueType === "pre-school"
  //             ? "Preschool"
  //             : gig?.venueType === "Private Club"
  //             ? "PrivateClub"
  //             : gig?.venueType === "Public Space"
  //             ? "PublicSpace"
  //             : gig?.venueType === "TV Studio"
  //             ? "TV_Studio"
  //             : gig?.venueType,
  //         gigDate: gig.gigDate ? new Date(gig.gigDate) : null,
  //         timeStart:
  //           gig.gigDate && gig.timeStart
  //             ? new Date(`${gig.gigDate} ${gig.timeStart}`)
  //             : null,
  //         timeEnd:
  //           gig.gigDate && gig.timeEnd
  //             ? new Date(`${gig.gigDate} ${gig.timeEnd}`)
  //             : null,
  //         createdAt: gig.createdAt ? new Date(gig.createdAt) : null,
  //         updatedAt: gig.updatedAt ? new Date(gig.updatedAt) : null,
  //         notesVenue: Buffer.from(gig.notesVenue, "binary").toString("utf8"),
  //         notesGig: Buffer.from(gig.notesGig, "binary").toString("utf8"),
  //       };
  //     } catch (error) {
  //       console.error(`Error creating gig at row ${index + 1}:`, error);
  //       return null; // Skip the row
  //     }
  //   })
  //     .slice(0, 100)
  //     .filter(Boolean); // Remove any null/undefined values

  //   console.log(formattedGigs);

  //   const res = await prisma.gig
  //     .createMany({
  //       data: formattedGigs,
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  // if (false) {
  //   // console.log(Gigs[0]);
  //   const formattedGigs = Promise.all(
  //     Gigs.map(async (gig) => {
  //       console.log("gig", gig);
  //       const exists = await prisma.gig.findFirst({
  //         where: {
  //           id: gig.id,
  //         },
  //       });

  //       console.log("exists", exists, gig.id);

  //       // const exists = false;
  //       if (!exists?.id) {
  //         return {
  //           ...gig,
  //           venueAddressZip: gig?.venueAddressZip?.toString(),
  //           serial: parseInt(gig?.serial),
  //           venueType:
  //             gig?.venueType === "Event Space"
  //               ? "Event_Space"
  //               : gig?.venueType === "other"
  //               ? "Other"
  //               : gig?.venueType === "Retail Space"
  //               ? "Retail_Space"
  //               : gig?.venueType === "Photo Studio"
  //               ? "PhotoStudio"
  //               : gig?.venueType === "pre-school"
  //               ? "Preschool"
  //               : gig?.venueType === "Private Club"
  //               ? "PrivateClub"
  //               : gig?.venueType === "Public Space"
  //               ? "PublicSpace"
  //               : gig?.venueType === "TV Studio"
  //               ? "TV_Studio"
  //               : gig?.venueType,
  //           gigDate: gig.gigDate ? new Date(gig.gigDate) : null,
  //           timeStart:
  //             gig.gigDate && gig.timeStart
  //               ? new Date(`${gig.gigDate} ${gig.timeStart}`)
  //               : null,
  //           timeEnd:
  //             gig.gigDate && gig.timeEnd
  //               ? new Date(`${gig.gigDate} ${gig.timeEnd}`)
  //               : null,

  //           createdAt: gig.createdAt ? new Date(gig.createdAt) : null,
  //           updatedAt: gig.updatedAt ? new Date(gig.updatedAt) : null,
  //           notesVenue: Buffer.from(gig.notesVenue, "binary").toString("utf8"),
  //           notesGig: Buffer.from(gig.notesGig, "binary").toString("utf8"),
  //         };

  //         console.log(formattedGigs);

  //         const res = await prisma.gig.createMany({
  //           data: formattedGigs,
  //         });
  //       }
  //     })
  //   );
  // }

  // // console.log(Sources);
  // // console.log(res);

  // const gigs = await prisma.gig.findMany({ take: 10 });
  // // const clients = await prisma.client.findMany();
  // // const sources = await prisma.source.findMany();
  // // console.log(clients.length);

  // return redirect("/dashboard/gigs");

  // // <>
  // //   <Header heading="Welcome back, Andres!" separator={true} />

  // //   <h1 className="w-full text-4xl">
  // //     {/* {JSON.stringify(gigs)} */}
  // //     {/* {JSON.stringify(clients)} */}
  // //     {/* {JSON.stringify(sources)} */}
  // //   </h1>
  // // </>
  return null;
}
