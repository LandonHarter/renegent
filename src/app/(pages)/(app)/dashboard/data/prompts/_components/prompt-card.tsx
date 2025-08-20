"use client";

import { Prompt } from "@prisma/client";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Variable } from "lucide-react";
import Link from "next/link";

interface PromptCardProps {
	prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const truncateText = (text: string, maxLength: number = 100) => {
		return text.length > maxLength
			? text.substring(0, maxLength) + "..."
			: text;
	};

	return (
		<Link
			href={`/dashboard/data/prompt/${prompt.promptId}`}
			className="h-full"
		>
			<Card className="h-[250px] transition-all duration-200 hover:scale-[1.01] hover:shadow-md">
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							<div className="bg-background flex h-8 w-8 items-center justify-center rounded-lg border">
								<FileText className="text-muted-foreground h-4 w-4" />
							</div>
							<div className="min-w-0 flex-1">
								<CardTitle className="truncate text-base">
									{prompt.name}
								</CardTitle>
								{prompt.variables.length > 0 && (
									<CardDescription className="mt-1 flex items-center gap-1 text-xs">
										<Variable className="h-3 w-3" />
										{prompt.variables.length} variable
										{prompt.variables.length !== 1
											? "s"
											: ""}
									</CardDescription>
								)}
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent className="h-full pt-0">
					<div className="flex h-full flex-col justify-between">
						<div className="flex flex-col gap-3">
							<div className="text-muted-foreground text-sm">
								{truncateText(prompt.prompt)}
							</div>

							{prompt.variables.length > 0 && (
								<div className="flex flex-wrap gap-1">
									{prompt.variables
										.slice(0, 3)
										.map((variable) => (
											<Badge
												key={variable}
												variant="outline"
												className="text-xs"
											>
												{variable}
											</Badge>
										))}
									{prompt.variables.length > 3 && (
										<Badge
											variant="outline"
											className="text-xs"
										>
											+{prompt.variables.length - 3} more
										</Badge>
									)}
								</div>
							)}
						</div>

						<div className="text-muted-foreground space-y-1 text-xs">
							<div className="flex justify-between">
								<span>Created:</span>
								<span>{formatDate(prompt.createdAt)}</span>
							</div>
							<div className="flex justify-between">
								<span>Updated:</span>
								<span>{formatDate(prompt.updatedAt)}</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
