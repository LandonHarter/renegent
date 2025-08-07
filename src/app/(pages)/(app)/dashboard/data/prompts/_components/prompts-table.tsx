"use client";

import { Prompt } from "@prisma/client";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface PromptsTableProps {
	prompts: Prompt[];
}

export default function PromptsTable({ prompts }: PromptsTableProps) {
	const router = useRouter();

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const truncateText = (text: string, maxLength: number = 80) => {
		return text.length > maxLength
			? text.substring(0, maxLength) + "..."
			: text;
	};

	if (prompts.length === 0) {
		return (
			<div className="rounded-lg border border-dashed p-8 text-center">
				<p className="text-muted-foreground">No prompts found</p>
				<p className="text-muted-foreground mt-1 text-sm">
					Try adjusting your search or create a new prompt.
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Prompt</TableHead>
						<TableHead>Variables</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Updated</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{prompts.map((prompt) => (
						<TableRow
							key={prompt.id}
							className="hover:bg-accent/50 cursor-pointer"
							onClick={() => {
								router.push(
									`/dashboard/data/prompt/${prompt.promptId}`
								);
								console.log(prompt.id);
							}}
						>
							<TableCell>
								<div className="flex items-center gap-3">
									<div className="bg-background flex h-6 w-6 items-center justify-center rounded border">
										<FileText className="text-muted-foreground h-3 w-3" />
									</div>
									<span className="font-medium">
										{prompt.name}
									</span>
								</div>
							</TableCell>
							<TableCell className="max-w-md">
								<span className="text-muted-foreground text-sm">
									{truncateText(prompt.prompt)}
								</span>
							</TableCell>
							<TableCell>
								<div className="flex flex-wrap gap-1">
									{prompt.variables.length === 0 ? (
										<span className="text-muted-foreground text-sm">
											None
										</span>
									) : (
										<>
											{prompt.variables
												.slice(0, 2)
												.map((variable) => (
													<Badge
														key={variable}
														variant="outline"
														className="text-xs"
													>
														{variable}
													</Badge>
												))}
											{prompt.variables.length > 2 && (
												<Badge
													variant="outline"
													className="text-xs"
												>
													+
													{prompt.variables.length -
														2}
												</Badge>
											)}
										</>
									)}
								</div>
							</TableCell>
							<TableCell className="text-muted-foreground text-sm">
								{formatDate(prompt.createdAt)}
							</TableCell>
							<TableCell className="text-muted-foreground text-sm">
								{formatDate(prompt.updatedAt)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
