import DashboardTitle from "@/components/dashboard/title";
import DashboardWrapper from "@/components/dashboard/wrapper";
import NoProvidersWarning from "@/app/(pages)/(app)/dashboard/ai/models/create/_components/no-providers-warning";
import ModelCreationForm from "@/app/(pages)/(app)/dashboard/ai/models/create/_components/model-creation-form";
import { createTrpcServer } from "@/trpc/server";
import { hasConfiguredProviders } from "@/lib/providers-utils";

export default async function CreateModelPage() {
	const trpcServer = await createTrpcServer();
	const providers = await trpcServer.providers.get();
	const hasProviders = hasConfiguredProviders(providers);
	const models = await trpcServer.models.list();

	return (
		<DashboardWrapper>
			<DashboardTitle
				title="Create Model"
				description="Configure your custom AI model with your preferred provider"
			/>

			{!hasProviders && (
				<NoProvidersWarning
					title="No AI Providers Configured"
					description="To create AI models, you need to configure at least one AI provider. Add your API keys to get started with model creation."
					className="mb-6"
				/>
			)}

			<ModelCreationForm
				hasProviders={hasProviders}
				existingModels={models}
			/>
		</DashboardWrapper>
	);
}
