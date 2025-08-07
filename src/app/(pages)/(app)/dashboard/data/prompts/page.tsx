import DashboardTitle from "@/components/dashboard/title";
import DashboardWrapper from "@/components/dashboard/wrapper";
import { Button } from "@/components/ui/button";
import { createTrpcServer } from "@/trpc/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PromptsProvider } from "./_context/prompts-context";
import PromptsPageContent from "./_components/prompts-page-content";

export default async function PromptsPage() {
	const trpcServer = await createTrpcServer();
	const prompts = await trpcServer.prompts.list();

	return (
		<DashboardWrapper>
			<div className="flex items-center justify-between">
				<DashboardTitle
					title="Prompts"
					description="Manage your prompts for AI interactions"
				/>
				<Button asChild>
					<Link
						href="/dashboard/data/prompts/create"
						className="flex items-center gap-2"
					>
						<Plus className="h-4 w-4" />
						Create Prompt
					</Link>
				</Button>
			</div>

			<PromptsProvider initialPrompts={prompts}>
				<PromptsPageContent />
			</PromptsProvider>
		</DashboardWrapper>
	);
}
