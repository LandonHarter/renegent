import DashboardTitle from "@/components/dashboard/title";
import DashboardWrapper from "@/components/dashboard/wrapper";
import { createTrpcServer } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Variable, Edit, Calendar } from "lucide-react";
import Link from "next/link";

export default async function PromptPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: promptId } = await params;
	const trpcServer = await createTrpcServer();
	const prompt = await trpcServer.prompts.get(promptId);

	if (!prompt) {
		redirect("/dashboard/data/prompts");
	}

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<DashboardWrapper>
			<div className="flex items-center justify-between">
				<DashboardTitle title={prompt.name} />
				<Link href={`/dashboard/data/prompt/${prompt.promptId}/edit`}>
					<Button size="sm" className="flex items-center gap-2">
						<Edit className="h-4 w-4" />
						Edit Prompt
					</Button>
				</Link>
			</div>

			<div className="space-y-6">
				{/* Variables Section */}
				{prompt.variables.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Variable className="h-4 w-4" />
								Variables ({prompt.variables.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								{prompt.variables.map((variable) => (
									<Badge
										key={variable}
										variant="outline"
										className="font-mono"
									>
										{`{{${variable}}}`}
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Prompt Content */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<FileText className="h-4 w-4" />
							Prompt Content
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="bg-muted/30 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
							{prompt.prompt}
						</div>
					</CardContent>
				</Card>

				{/* Metadata */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<Calendar className="h-4 w-4" />
							Information
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
							<div className="space-y-1">
								<p className="text-muted-foreground">Created</p>
								<p className="font-medium">
									{formatDate(prompt.createdAt)}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-muted-foreground">
									Last Updated
								</p>
								<p className="font-medium">
									{formatDate(prompt.updatedAt)}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-muted-foreground">
									Prompt ID
								</p>
								<p className="font-mono text-xs">
									{prompt.promptId}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-muted-foreground">
									Database ID
								</p>
								<p className="font-mono text-xs">{prompt.id}</p>
							</div>
							<div className="space-y-1">
								<p className="text-muted-foreground">
									Character Count
								</p>
								<p className="font-medium">
									{prompt.prompt.length} characters
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</DashboardWrapper>
	);
}
