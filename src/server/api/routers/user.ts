import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.example.findMany();
  // }),
  // create: protectedProcedure
  //   .input(z.object({ task: z.string() }))
  //   .mutation(async ({ input, ctx }) => {
  //     return await ctx.prisma.todo.create({
  //       data: {
  //         task: input.task,
  //         userId: ctx.session.user.id,
  //       },
  //     });
  //   }),
});
