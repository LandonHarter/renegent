import { appRouter } from "./router";
import { createTrpcContext } from "./trpc";

export async function createTrpcServer(renegentApiKey?: string) {
	return appRouter.createCaller(await createTrpcContext(renegentApiKey));
}
