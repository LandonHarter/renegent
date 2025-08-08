import DashboardTitle from "@/components/dashboard/title";
import DashboardWrapper from "@/components/dashboard/wrapper";
import { createTrpcServer } from "@/trpc/server";
import { KnowledgeBasesProvider } from "./_context/knowledge-bases-context";
import KnowledgeBasesPageContent from "./_components/knowledge-bases-page-content";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function KnowledgeBasesPage() {
	const trpcServer = await createTrpcServer();
	const knowledgeBases = await trpcServer.knowledgeBases.list();

	return (
		<DashboardWrapper>
			<DashboardTitle
				title="Knowledge Bases"
				description="Manage your centralized knowledge storage for AI interactions"
			>
				<Link href="/dashboard/data/knowledge-bases/create">
					<Button>
						<Plus className="h-4 w-4" />
						Create Knowledge Base
					</Button>
				</Link>
			</DashboardTitle>

			<KnowledgeBasesProvider initialKnowledgeBases={knowledgeBases}>
				<KnowledgeBasesPageContent />
			</KnowledgeBasesProvider>
		</DashboardWrapper>
	);
}
