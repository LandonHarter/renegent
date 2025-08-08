import DashboardTitle from "@/components/dashboard/title";
import DashboardWrapper from "@/components/dashboard/wrapper";
import { createTrpcServer } from "@/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Calendar, Hash } from "lucide-react";
import { notFound } from "next/navigation";
import VectorSearch from "./_components/vector-search";

interface SourcePageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function SourcePage({ params }: SourcePageProps) {
	const { id } = await params;
	const trpcServer = await createTrpcServer();

	try {
		const source = await trpcServer.data.get(id);

		if (!source) {
			notFound();
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
				<DashboardTitle
					title={source.name}
					description="Data source details and information"
				/>

				<div className="space-y-6">
					{/* Source Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Database className="h-5 w-5" />
								Source Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-1">
									<p className="text-muted-foreground text-sm font-medium">
										Name
									</p>
									<p className="text-sm">{source.name}</p>
								</div>
								<div className="space-y-1">
									<p className="text-muted-foreground text-sm font-medium">
										Type
									</p>
									<Badge
										variant="secondary"
										className="w-fit"
									>
										Document
									</Badge>
								</div>
								<div className="space-y-1">
									<p className="text-muted-foreground text-sm font-medium">
										<Hash className="mr-1 inline h-3 w-3" />
										Source ID
									</p>
									<p className="font-mono text-sm">
										{source.id}
									</p>
								</div>
								<div className="space-y-1">
									<p className="text-muted-foreground text-sm font-medium">
										<Calendar className="mr-1 inline h-3 w-3" />
										Created
									</p>
									<p className="text-sm">
										{formatDate(source.createdAt)}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Processing Status */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Database className="h-5 w-5" />
								Processing Status
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-2">
								<Badge
									variant="default"
									className="bg-green-100 text-green-800"
								>
									✓ Processed
								</Badge>
								<p className="text-muted-foreground text-sm">
									Content has been chunked and embedded for
									search
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Vector Search */}
					<VectorSearch sourceId={source.id} />
				</div>
			</DashboardWrapper>
		);
	} catch (error) {
		notFound();
	}
}
