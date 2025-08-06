import DashboardTitle from "@/components/dashboard/title";
import DashboardWrapper from "@/components/dashboard/wrapper";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoIcon } from "lucide-react";

export default function Loading() {
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
			<div className="space-y-6">
				{/* Auto-save status skeleton */}
				<div className="text-muted-foreground flex items-center gap-2 text-sm">
					<Skeleton className="h-3 w-3 rounded-full" />
					<Skeleton className="h-4 w-32" />
				</div>

				{/* Accordion skeleton */}
				<div className="w-full space-y-4">
					{/* Provider skeleton items */}
					{Array.from({ length: 4 }, (_, i) => (
						<div
							key={i}
							className="space-y-4 rounded-lg border px-4 py-4"
						>
							{/* Accordion trigger skeleton */}
							<div className="flex items-center gap-3">
								<Skeleton className="h-6 w-6 rounded" />
								<Skeleton className="h-5 w-20" />
								<div className="ml-auto">
									<Skeleton className="h-2 w-2 rounded-full" />
								</div>
							</div>

							{/* Accordion content skeleton (shown on first item) */}
							{i === 0 && (
								<div className="space-y-4 px-2 pt-4 pb-6">
									{Array.from(
										{ length: 2 },
										(_, fieldIndex) => (
											<div
												key={fieldIndex}
												className="space-y-2"
											>
												<Skeleton className="h-4 w-16" />
												<Skeleton className="h-10 w-full" />
											</div>
										)
									)}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</DashboardWrapper>
	);
}
