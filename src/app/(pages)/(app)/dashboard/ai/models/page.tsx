import DashboardTitle from "@/components/dashboard/title";
import DashboardWrapper from "@/components/dashboard/wrapper";
import { Button } from "@/components/ui/button";
import { createTrpcServer } from "@/trpc/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ModelsProvider } from "./_context/models-context";
import ModelsPageContent from "./_components/models-page-content";

export default async function ModelsPage() {
	const trpcServer = await createTrpcServer();
	const models = await trpcServer.models.list();

	return (
		<DashboardWrapper>
			<div className="flex items-center justify-between">
				<DashboardTitle
					title="AI Models"
					description="Manage your custom AI model configurations"
				/>
				<Button asChild>
					<Link
						href="/dashboard/ai/models/create"
						className="flex items-center gap-2"
					>
						<Plus className="h-4 w-4" />
						Create Model
					</Link>
				</Button>
			</div>

			<ModelsProvider initialModels={models}>
				<ModelsPageContent />
			</ModelsProvider>
		</DashboardWrapper>
	);
}
