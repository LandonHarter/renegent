import z from "zod";
import { authorizedProcedure } from "../procedures";
import { router } from "../trpc";
import prisma from "@/lib/prisma";

// Define ProvidersSchema if not available in types
const ProvidersUpdateSchema = z.object({
	openaiApiKey: z.string().optional(),
	openaiBaseUrl: z.string().optional(),
	anthropicApiKey: z.string().optional(),
	anthropicBaseUrl: z.string().optional(),
	googleGenApiKey: z.string().optional(),
	googleGenBaseUrl: z.string().optional(),
	azureResourceName: z.string().optional(),
	azureApiKey: z.string().optional(),
	xApiKey: z.string().optional(),
	xBaseurl: z.string().optional(),
	deepseekApiKey: z.string().optional(),
	deepseekBaseUrl: z.string().optional(),
	perplexityApiKey: z.string().optional(),
	perplexityBaseUrl: z.string().optional(),
});

export const providersRouter = router({
	get: authorizedProcedure.query(async ({ ctx }) => {
		const providers = await prisma.providers.findUnique({
			where: {
				id: ctx.user?.id!,
			},
		});
		return providers;
	}),
	updateKeys: authorizedProcedure
		.input(ProvidersUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			await prisma.providers.upsert({
				where: {
					id: ctx.user?.id!,
				},
				update: {
					...input,
				},
				create: {
					id: ctx.user?.id!,
					...input,
				},
			});
		}),
});
