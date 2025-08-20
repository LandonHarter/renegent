import DashboardTitle from "@/components/dashboard/title";
import DashboardWrapper from "@/components/dashboard/wrapper";
import { createTrpcServer } from "@/trpc/server";
import PlaygroundLayout from "./_components/playground-layout";
import ApiKeyWarning from "./_components/api-key-warning";

export default async function PlaygroundPage() {
	const trpcServer = await createTrpcServer();
	const models = await trpcServer.models.list();
	const prompts = await trpcServer.prompts.list();
	const keys = await trpcServer.keys.get();

	const hasApiKeys = keys.length > 0;
	const firstApiKey = keys.length > 0 ? keys[0].key : undefined;

	return (
		<DashboardWrapper>
			<DashboardTitle
				title="Playground"
				description="Mess around with your models and prompts"
			/>
			{!hasApiKeys && <ApiKeyWarning />}
			<PlaygroundLayout
				models={models}
				prompts={prompts}
				disabled={!hasApiKeys}
				apiKey={firstApiKey}
			/>
		</DashboardWrapper>
	);
}
