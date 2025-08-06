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

export const serverProcedure = publicProcedure.use(async ({ ctx, next }) => {
	const renegentApiKey = ctx.renegentApiKey;
	if (!renegentApiKey) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
		});
	}
	if (renegentApiKey !== process.env.RENEGENT_API_KEY) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
		});
	}

	return next({
		ctx,
	});
});
