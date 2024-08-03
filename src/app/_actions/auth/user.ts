"use server";

import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";

import type { User } from "@prisma/client";

import { fromErrorToResponse, parseFormData } from "@/lib/utils";
import type { GetUsersProps, Response } from "@/types/index";
import {
  type CreateUserProps,
  createUserSchema,
  type UpdateUserProps,
  updateUserSchema,
} from "@/lib/validations/user";

export async function getUser(id: string): Promise<Response<User>> {
  if (id.length === 0) {
    return {
      result: "ERROR",
      description: "Invalid user ID",
    };
  }

  try {
    const user = await prisma.user.findFirst({
      where: { id },
    });

    return {
      result: "SUCCESS",
      description: user ? "User found" : "User not found",
      data: user ? user : undefined,
    };
  } catch (error) {
    return fromErrorToResponse(error);
  }
}

export async function getUsers({
  select,
  whereClause = {},
  orderBy = [],
  limit = 20,
  skip = 0,
}: GetUsersProps): Promise<Response<User>> {
  try {
    const [totalCount, users] = await prisma.$transaction([
      prisma.user.count({ where: whereClause }),
      prisma.user.findMany({
        select: select || undefined,
        where: whereClause,
        orderBy,
        take: limit,
        skip,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = Math.floor(skip / limit) + 1;

    return {
      result: "SUCCESS",
      description: "Users fetched successfully",
      data: {
        items: users,
        pagination: {
          totalCount,
          pageSize: limit,
          currentPage,
          totalPages,
        },
      },
    };
  } catch (error) {
    return fromErrorToResponse(error);
  }
}

export async function createUser(formData: FormData): Promise<Response<User>> {
  if (!formData) {
    return {
      result: "ERROR",
      description: "Missing parameters",
    };
  }

  try {
    const parsedData = parseFormData<CreateUserProps>(
      formData,
      createUserSchema,
    );
    const user = await prisma.user.create({
      data: parsedData,
    });

    revalidatePath(`/dashboard/users/`);
    revalidatePath(`/dashboard/users/${user.id}`);

    return {
      result: "SUCCESS",
      description: "User created successfully",
      data: user,
    };
  } catch (error) {
    return fromErrorToResponse(error);
  }
}

export async function updateUser(
  id: string,
  formData: FormData,
): Promise<Response<User>> {
  if (!id || !formData) {
    return {
      result: "ERROR",
      description: "Missing parameters",
    };
  }

  try {
    const parsedData = parseFormData<UpdateUserProps>(
      formData,
      updateUserSchema,
    );
    const updatedUser = await prisma.user.update({
      where: { id },
      data: parsedData,
    });

    revalidatePath(`/dashboard/users/${id}`);

    return {
      result: "SUCCESS",
      description: "User updated successfully",
      data: updatedUser,
    };
  } catch (error) {
    return fromErrorToResponse(error);
  }
}
