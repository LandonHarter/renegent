import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { serverProcedure } from "../procedures";

export const authRouter = router({
	isVerifiedEmail: publicProcedure
		.input(z.string())
		.query(async ({ input }) => {
			const user = await prisma.user.findUnique({
				where: {
					email: input,
				},
			});
			if (!user)
				return {
					verified: false,
					exists: false,
				};

			return {
				verified: user.emailVerified,
				exists: true,
			};
		}),
	setupUser: serverProcedure
		.input(
			z.object({
				userId: z.string(),
			})
		)
		.mutation(async ({ input }) => {
			await prisma.providers.create({
				data: {
					user: {
						connect: {
							id: input.userId,
						},
					},
				},
			});
		}),
});
