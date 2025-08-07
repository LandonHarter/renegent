import DashboardTitle from "@/components/dashboard/title";
import DashboardWrapper from "@/components/dashboard/wrapper";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ModelsPage() {
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

			{/* TODO: Add models list component here */}
			<div className="rounded-lg border border-dashed p-8 text-center">
				<p className="text-muted-foreground">
					Models list coming soon...
				</p>
				<p className="text-muted-foreground mt-1 text-sm">
					For now, you can create new models using the button above.
				</p>
			</div>
		</DashboardWrapper>
	);
}
