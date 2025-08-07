import { AlertTriangle, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface NoProvidersWarningProps {
	className?: string;
	title?: string;
	description?: string;
	showConfigureButton?: boolean;
}

export default function NoProvidersWarning({
	className = "",
	title = "No AI Providers Configured",
	description = "You need to configure at least one AI provider to create and use models. Add your API keys to get started.",
	showConfigureButton = true,
}: NoProvidersWarningProps) {
	return (
		<Card
			className={`gap-0 border-amber-200 bg-amber-50 shadow-none dark:border-amber-900/50 dark:bg-amber-950/50 ${className}`}
		>
			<CardHeader className="pb-4">
				<div className="flex items-center gap-3">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
						<AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
					</div>
					<div>
						<CardTitle className="text-base text-amber-900 dark:text-amber-100">
							{title}
						</CardTitle>
						<CardDescription className="text-amber-700 dark:text-amber-300">
							{description}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			{showConfigureButton && (
				<CardContent className="pt-0">
					<div className="flex flex-col gap-3 sm:flex-row">
						<Button
							asChild
							className="bg-amber-600 text-white hover:bg-amber-700"
						>
							<Link
								href="/dashboard/developer/integration/providers"
								className="flex items-center gap-2 text-sm"
							>
								<Settings className="size-4" />
								Configure Providers
							</Link>
						</Button>
						<Button
							variant="outline"
							asChild
							className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/50"
						>
							<Link
								href="https://docs.renegent.dev"
								target="_blank"
								className="flex items-center gap-2 text-sm"
							>
								<ExternalLink className="size-4" />
								Learn More
							</Link>
						</Button>
					</div>
				</CardContent>
			)}
		</Card>
	);
}
