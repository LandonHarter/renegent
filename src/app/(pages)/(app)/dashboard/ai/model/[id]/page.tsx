import DashboardTitle from "@/components/dashboard/title";
import DashboardWrapper from "@/components/dashboard/wrapper";
import { getProvider } from "@/data/models";
import { createTrpcServer } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Database } from "lucide-react";

export default async function ModelPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;
	const trpcServer = await createTrpcServer();
	const model = await trpcServer.models.get(id);

	if (!model) {
		redirect("/dashboard/ai/models/create");
	}

	return (
		<DashboardWrapper>
			<DashboardTitle
				title={model.name}
				image={getProvider(model.provider)?.icon}
			/>

			<div className="space-y-6">
				{/* Model Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Database className="h-5 w-5" />
							Model Details
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="text-sm font-medium">Model ID</p>
							<p className="text-muted-foreground font-mono text-sm">
								{model.modelId}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium">Provider</p>
							<Badge variant="secondary">
								{getProvider(model.provider)?.name}
							</Badge>
						</div>
						<div>
							<p className="text-sm font-medium">
								Provider Model
							</p>
							<p className="text-muted-foreground font-mono text-sm">
								{model.providerModelId}
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Attached Knowledge Bases */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BookOpen className="h-5 w-5" />
							Attached Knowledge Bases
							<Badge variant="outline">
								{model.knowledgeBases?.length || 0}
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						{model.knowledgeBases &&
						model.knowledgeBases.length > 0 ? (
							<div className="grid gap-3 md:grid-cols-2">
								{model.knowledgeBases.map((kb) => (
									<div
										key={kb.id}
										className="bg-muted/50 flex items-center gap-3 rounded-lg border p-3"
									>
										<BookOpen className="text-muted-foreground h-4 w-4" />
										<div>
											<p className="text-sm font-medium">
												{kb.name}
											</p>
											<p className="text-muted-foreground text-xs">
												Created{" "}
												{new Date(
													kb.createdAt
												).toLocaleDateString()}
											</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-muted-foreground flex flex-col items-center py-8 text-center">
								<BookOpen className="mb-2 h-8 w-8" />
								<p className="text-sm">
									No knowledge bases attached
								</p>
								<p className="text-xs">
									Knowledge bases provide context and
									information to enhance AI responses
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</DashboardWrapper>
	);
}
