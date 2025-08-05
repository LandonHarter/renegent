import { auth } from "@/auth/server";
import { initTRPC } from "@trpc/server";
import { User } from "better-auth";
import { headers } from "next/headers";
import superjson from "superjson";

export async function createTrpcContext() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return {
		user: session?.user as User | null,
		signedIn: !!session?.user,
	};
}

type Context = Awaited<ReturnType<typeof createTrpcContext>>;
const t = initTRPC.context<Context>().create({
	transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
