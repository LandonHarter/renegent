import DashboardTitle from "@/components/dashboard/title";
import DashboardWrapper from "@/components/dashboard/wrapper";
import KnowledgeBaseCreationForm from "./_components/knowledge-base-creation-form";
import { createTrpcServer } from "@/trpc/server";

export default async function KnowledgeBasesCreatePage() {
	const trpcServer = await createTrpcServer();
	const dataSources = await trpcServer.data.list();

	return (
		<DashboardWrapper>
			<DashboardTitle
				title="Create Knowledge Base"
				description="Combine multiple data sources into a unified knowledge base for AI interactions"
			/>

			<KnowledgeBaseCreationForm dataSources={dataSources} />
		</DashboardWrapper>
	);
}
