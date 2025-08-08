import { authRouter } from "./routers/auth";
import { keysRouter } from "./routers/keys";
import { providersRouter } from "./routers/providers";
import { modelsRouter } from "./routers/models";
import { router } from "./trpc";
import { promptsRouter } from "./routers/prompts";
import { dataRouter } from "./routers/data";
import { vectorRouter } from "./routers/vector";

export const appRouter = router({
	auth: authRouter,
	providers: providersRouter,
	keys: keysRouter,
	models: modelsRouter,
	prompts: promptsRouter,
	data: dataRouter,
	vector: vectorRouter,
});
export type AppRouter = typeof appRouter;
