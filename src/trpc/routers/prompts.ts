import z from "zod";
import { authorizedProcedure } from "../procedures";
import { router } from "../trpc";
import prisma from "@/lib/prisma";

export const promptsRouter = router({
	create: authorizedProcedure
		.input(
			z.object({
				name: z.string().min(1),
				promptId: z.string().min(1),
				prompt: z.string().min(1),
				variables: z.array(z.string()),
			})
		)
		.mutation(async ({ input, ctx }) => {
			// Check if prompt with same promptId already exists for this user
			const existingPrompt = await prisma.prompt.findFirst({
				where: {
					userId: ctx.user?.id!,
					promptId: input.promptId,
				},
			});

			if (existingPrompt) {
				throw new Error("A prompt with this ID already exists");
			}

			return await prisma.prompt.create({
				data: {
					name: input.name,
					promptId: input.promptId,
					prompt: input.prompt,
					variables: input.variables,
					userId: ctx.user?.id!,
				},
			});
		}),
	list: authorizedProcedure.query(async ({ ctx }) => {
		return await prisma.prompt.findMany({
			where: {
				userId: ctx.user?.id!,
			},
		});
	}),
	get: authorizedProcedure.input(z.string()).query(async ({ input, ctx }) => {
		return await prisma.prompt.findFirst({
			where: {
				promptId: input,
				userId: ctx.user?.id!,
			},
		});
	}),
	update: authorizedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().min(1),
				promptId: z.string().min(1),
				prompt: z.string().min(1),
				variables: z.array(z.string()),
			})
		)
		.mutation(async ({ input, ctx }) => {
			// Check if another prompt with same promptId already exists for this user
			const existingPrompt = await prisma.prompt.findFirst({
				where: {
					userId: ctx.user?.id!,
					promptId: input.promptId,
					NOT: {
						id: input.id,
					},
				},
			});

			if (existingPrompt) {
				throw new Error("A prompt with this ID already exists");
			}

			return await prisma.prompt.update({
				where: {
					id: input.id,
					userId: ctx.user?.id!,
				},
				data: {
					name: input.name,
					promptId: input.promptId,
					prompt: input.prompt,
					variables: input.variables,
				},
			});
		}),
});
