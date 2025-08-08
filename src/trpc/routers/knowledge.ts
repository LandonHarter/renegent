import z from "zod";
import { authorizedProcedure } from "../procedures";
import { router } from "../trpc";
import prisma from "@/lib/prisma";

export const knowledgeBasesRouter = router({
	list: authorizedProcedure.query(async ({ ctx }) => {
		return await prisma.knowledgeBase.findMany({
			where: {
				userId: ctx.user?.id!,
			},
		});
	}),
	create: authorizedProcedure
		.input(
			z.object({
				name: z.string(),
				dataSourceIds: z.array(z.string()),
			})
		)
		.mutation(async ({ ctx, input }) => {
			return await prisma.knowledgeBase.create({
				data: {
					name: input.name,
					userId: ctx.user?.id!,
					dataSources: {
						connect: input.dataSourceIds.map((id) => ({ id })),
					},
				},
			});
		}),
});
