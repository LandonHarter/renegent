import z from "zod";
import { authorizedProcedure } from "../procedures";
import { router } from "../trpc";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export const keysRouter = router({
	get: authorizedProcedure.query(async ({ ctx }) => {
		return await prisma.apiKey.findMany({
			where: {
				userId: ctx.user?.id!,
			},
		});
	}),
	create: authorizedProcedure
		.input(z.string())
		.mutation(async ({ ctx, input }) => {
			const key = `ren-${crypto.randomBytes(32).toString("hex")}`;
			return await prisma.apiKey.create({
				data: {
					key,
					name: input,
					user: {
						connect: {
							id: ctx.user?.id!,
						},
					},
				},
			});
		}),
	detele: authorizedProcedure
		.input(z.string())
		.mutation(async ({ ctx, input }) => {
			await prisma.apiKey.delete({
				where: {
					id: input,
				},
			});
		}),
	toggle: authorizedProcedure
		.input(z.string())
		.mutation(async ({ ctx, input }) => {
			const key = await prisma.apiKey.findUnique({
				where: {
					id: input,
					userId: ctx.user?.id!,
				},
				select: {
					enabled: true,
				},
			});

			await prisma.apiKey.update({
				where: {
					id: input,
					userId: ctx.user?.id!,
				},
				data: {
					enabled: !key?.enabled,
				},
			});
		}),
});
