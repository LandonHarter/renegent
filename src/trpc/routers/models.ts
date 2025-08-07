import z from "zod";
import { authorizedProcedure } from "../procedures";
import { router } from "../trpc";
import prisma from "@/lib/prisma";
import { Provider } from "@prisma/client";

const ModelCreateSchema = z.object({
	name: z
		.string()
		.min(1, "Model name is required")
		.max(100, "Model name must be less than 100 characters"),
	modelId: z
		.string()
		.min(1, "Model ID is required")
		.max(100, "Model ID must be less than 100 characters"),
	provider: z.nativeEnum(Provider),
	providerModelId: z.string().min(1, "Provider model ID is required"),
});

export const modelsRouter = router({
	create: authorizedProcedure
		.input(ModelCreateSchema)
		.mutation(async ({ ctx, input }) => {
			// Check if model with same modelId already exists for this user
			const existingModel = await prisma.model.findFirst({
				where: {
					userId: ctx.user?.id!,
					modelId: input.modelId,
				},
			});

			if (existingModel) {
				throw new Error("A model with this ID already exists");
			}

			const model = await prisma.model.create({
				data: {
					name: input.name,
					modelId: input.modelId,
					provider: input.provider,
					providerModelId: input.providerModelId,
					userId: ctx.user?.id!,
				},
			});

			return model;
		}),

	list: authorizedProcedure.query(async ({ ctx }) => {
		const models = await prisma.model.findMany({
			where: {
				userId: ctx.user?.id!,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return models;
	}),
	get: authorizedProcedure.input(z.string()).query(async ({ ctx, input }) => {
		const model = await prisma.model.findFirst({
			where: {
				id: input,
				userId: ctx.user?.id!,
			},
		});

		if (!model) {
			throw new Error("Model not found");
		}

		return model;
	}),

	delete: authorizedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const model = await prisma.model.findFirst({
				where: {
					id: input.id,
					userId: ctx.user?.id!,
				},
			});

			if (!model) {
				throw new Error("Model not found");
			}

			await prisma.model.delete({
				where: {
					id: input.id,
				},
			});

			return { success: true };
		}),
});
