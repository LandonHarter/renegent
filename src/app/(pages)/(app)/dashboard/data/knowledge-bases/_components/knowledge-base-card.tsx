"use client";

import { KnowledgeBase } from "@prisma/client";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Archive } from "lucide-react";
import Link from "next/link";

interface KnowledgeBaseCardProps {
	knowledgeBase: KnowledgeBase;
}

export default function KnowledgeBaseCard({
	knowledgeBase,
}: KnowledgeBaseCardProps) {
	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<Link href={`/dashboard/data/knowledge-bases/${knowledgeBase.id}`}>
			<Card className="transition-all duration-200 hover:scale-[1.01] hover:shadow-md">
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							<div className="bg-background flex h-8 w-8 items-center justify-center rounded-lg border">
								<Database className="text-muted-foreground h-4 w-4" />
							</div>
							<div className="min-w-0 flex-1">
								<CardTitle className="truncate text-base">
									{knowledgeBase.name}
								</CardTitle>
								<CardDescription className="mt-1 flex items-center gap-1 text-xs">
									<Archive className="h-3 w-3" />
									Knowledge Base
								</CardDescription>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="space-y-3">
						<div className="text-muted-foreground text-sm">
							Centralized knowledge storage for AI interactions
						</div>

						<div className="flex flex-wrap gap-1">
							<Badge variant="outline" className="text-xs">
								Active
							</Badge>
						</div>

						<div className="text-muted-foreground space-y-1 text-xs">
							<div className="flex justify-between">
								<span>Created:</span>
								<span>
									{formatDate(knowledgeBase.createdAt)}
								</span>
							</div>
							<div className="flex justify-between">
								<span>Updated:</span>
								<span>
									{formatDate(knowledgeBase.updatedAt)}
								</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
