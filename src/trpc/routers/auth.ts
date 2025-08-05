import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import prisma from "@/lib/prisma";

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
});
