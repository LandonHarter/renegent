import { publicProcedure } from "./trpc";
import { TRPCError } from "@trpc/server";

export const authorizedProcedure = publicProcedure.use(
	async ({ ctx, next }) => {
		if (!ctx.signedIn) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "You must be logged in to access this resource",
			});
		}

		return next({
			ctx,
		});
	}
);
