import DashboardTitle from "@/components/dashboard/title";
import DashboardWrapper from "@/components/dashboard/wrapper";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { createTrpcServer } from "@/trpc/server";
import ProvidersForm from "./_components/providers-form";

export default async function ProvidersPage() {
	const trpcServer = await createTrpcServer();
	const providers = await trpcServer.providers.get();

	return (
		<DashboardWrapper>
			<DashboardTitle
				title="Connect Providers"
				description={
					<div className="flex items-center gap-2">
						Add your API keys to use the providers
						<Tooltip>
							<TooltipTrigger asChild>
								<InfoIcon className="text-foreground/50 size-3 cursor-pointer" />
							</TooltipTrigger>
							<TooltipContent side="bottom" className="text-xs">
								Your API keys are stored securely
								<br />
								and are not shared with anyone.
							</TooltipContent>
						</Tooltip>
					</div>
				}
			/>
			<ProvidersForm initialData={providers} />
		</DashboardWrapper>
	);
}
