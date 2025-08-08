import z from "zod";
import { authorizedProcedure } from "../procedures";
import { router } from "../trpc";
import { voyage } from "voyage-ai-provider";
import { embed } from "ai";
import prisma from "@/lib/prisma";

const embeddingModel = voyage.textEmbeddingModel("voyage-3.5-lite");
export const vectorRouter = router({
	search: authorizedProcedure
		.input(
			z.object({
				source: z.string(),
				query: z.string(),
			})
		)
		.query(async ({ ctx, input }) => {
			const embedding = await embed({
				model: embeddingModel,
				value: input.query,
			});

			const results = await prisma.$queryRawUnsafe(
				`
				SELECT id, content
				FROM data_fragments
				WHERE "dataSourceId" = $1
				ORDER BY embedding <=> $2::vector
				LIMIT 5
			`,
				input.source,
				`[${embedding.embedding.join(",")}]`
			);

			return results as { id: string; content: string }[];
		}),
});
