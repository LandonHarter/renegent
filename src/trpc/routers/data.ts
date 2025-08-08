import { z } from "zod";
import { authorizedProcedure } from "../procedures";
import { router } from "../trpc";
import prisma from "@/lib/prisma";
import { chunkText } from "@/lib/chunking";
import { embedMany } from "ai";
import { voyage } from "voyage-ai-provider";
import crypto from "crypto";

const embeddingModel = voyage.textEmbeddingModel("voyage-3.5-lite");
export const dataRouter = router({
	list: authorizedProcedure.query(async ({ ctx }) => {
		return await prisma.dataSource.findMany({
			where: {
				userId: ctx.user?.id!,
			},
		});
	}),
	get: authorizedProcedure.input(z.string()).query(async ({ ctx, input }) => {
		return await prisma.dataSource.findFirst({
			where: {
				id: input,
				userId: ctx.user?.id!,
			},
		});
	}),
	create: authorizedProcedure
		.input(
			z.object({
				name: z.string(),
				description: z.string(),
				content: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const chunks = chunkText(input.content);
			console.log("Chunked text");
			const embeddings = await embedMany({
				model: embeddingModel,
				values: chunks,
			});
			console.log("Embedded text");

			const dataSource = await prisma.dataSource.create({
				data: {
					name: input.name,
					description: input.description,
					userId: ctx.user?.id!,
				},
			});
			console.log("Created data source");
			for (let i = 0; i < chunks.length; i++) {
				const embedding = embeddings.embeddings[i];
				const id = crypto.randomUUID();
				await prisma.$executeRaw`
                    INSERT INTO data_fragments (id, content, embedding, "dataSourceId")
                    VALUES (${id}, ${embeddings.values[i]}, ${embedding}, ${dataSource.id})
                `;
				console.log("Created data fragment");
			}
			console.log("Created all data fragments");

			return dataSource;
		}),
});
