import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ slideId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorised", { status: 401 });

  const { slideId } = await paramsPromise;
  const body = await req.json();
  const { title, content } = body;

  if (!title?.trim() || !content?.trim()) {
    return new NextResponse("Invalid input", { status: 400 });
  }

  try {
    const fetchSlide = await prisma.slide.findUnique({
      where: { id: slideId },
      select: { projectId: true },
    });

    if (!fetchSlide)
      return new NextResponse("Slide does not exist", { status: 404 });

    const projectId = fetchSlide.projectId;
    const collaborator = await prisma.collaborator.findFirst({
      where: { userId, projectId },
    });

    if (!collaborator || !["OWNER", "EDITOR"].includes(collaborator.role)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const update = await prisma.slide.update({
      where: { id: slideId },
      data: { title, content },
    });

    return NextResponse.json({ update });
  } catch (err) {
    console.error("Failed to update", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ slideId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorised", { status: 401 });

  const { slideId } = await paramsPromise;

  try {
    const fetch = await prisma.slide.findUnique({
      where: { id: slideId },
      select: { projectId: true },
    });

    if (!fetch)
      return new NextResponse("Slide does not exist", { status: 404 });

    const projectId = fetch.projectId;
    const collaborator = await prisma.collaborator.findFirst({
      where: { userId, projectId },
    });

    if (!collaborator || !["OWNER", "EDITOR"].includes(collaborator.role)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const deletedSlide = await prisma.slide.delete({ where: { id: slideId } });
    return NextResponse.json({ success: true, deleted: deletedSlide });
  } catch (error) {
    console.error("Failed to delete", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
