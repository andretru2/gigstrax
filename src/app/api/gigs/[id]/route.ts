import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return new NextResponse("No user with ID found", { status: 404 });
  }

  return NextResponse.json(user);
}

// export async function POST(request: Request) {
//   try {
//     const { title, content } = await request.json();

//     const newNote = await prisma.note.create({
//       data: {
//         title,
//         content,
//       },
//     });

//     return NextResponse.json(newNote);
//   } catch (error) {
//     return NextResponse.json(error, { status: 500 });
//   }
// }

export async function POST(request: Request) {
  try {
    const json = await request.json();

    const user = await prisma.user.create({
      data: json,
    });

    return new NextResponse(JSON.stringify(user), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return new NextResponse("User with email already exists", {
        status: 409,
      });
    }
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const json = await request.json();

  const res = await prisma.user.update({
    where: { id },
    data: json,
  });

  if (!res) {
    return new NextResponse("No record with ID found", { status: 404 });
  }

  return NextResponse.json(res);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await prisma.user.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return new NextResponse("No user with ID found", { status: 404 });
    }

    return new NextResponse(error.message, { status: 500 });
  }
}
