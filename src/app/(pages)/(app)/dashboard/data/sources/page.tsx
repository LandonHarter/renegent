import DashboardTitle from "@/components/dashboard/title";
import DashboardWrapper from "@/components/dashboard/wrapper";
import { Button } from "@/components/ui/button";
import { createTrpcServer } from "@/trpc/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { SourcesProvider } from "./_context/sources-context";
import SourcesPageContent from "./_components/sources-page-content";

export default async function DataSourcesPage() {
	const trpcServer = await createTrpcServer();
	const dataSources = await trpcServer.data.list();

	return (
		<DashboardWrapper>
			<div className="flex items-center justify-between">
				<DashboardTitle
					title="Data Sources"
					description="Manage your knowledge base and document sources"
				/>
				<Button asChild>
					<Link
						href="/dashboard/data/sources/create"
						className="flex items-center gap-2"
					>
						<Plus className="h-4 w-4" />
						Create Source
					</Link>
				</Button>
			</div>

			<SourcesProvider initialSources={dataSources}>
				<SourcesPageContent />
			</SourcesProvider>
		</DashboardWrapper>
	);
}
