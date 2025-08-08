"use client";

import { DataSource } from "@prisma/client";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Database } from "lucide-react";
import Link from "next/link";

interface SourceCardProps {
	source: DataSource;
}

export default function SourceCard({ source }: SourceCardProps) {
	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<Link href={`/dashboard/data/sources/${source.id}`} passHref>
			<Card className="transition-all duration-200 hover:scale-[1.01] hover:shadow-md">
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							<div className="bg-background flex h-8 w-8 items-center justify-center rounded-lg border">
								<Database className="text-muted-foreground h-4 w-4" />
							</div>
							<div>
								<CardTitle className="text-base">
									{source.name}
								</CardTitle>
								<CardDescription className="mt-1 text-xs">
									Data Source
								</CardDescription>
							</div>
						</div>
						<Badge variant="secondary" className="text-xs">
							<FileText className="mr-1 h-3 w-3" />
							Document
						</Badge>
					</div>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="text-muted-foreground space-y-2 text-sm">
						<div className="flex justify-between">
							<span>Created:</span>
							<span>{formatDate(source.createdAt)}</span>
						</div>
						<div className="flex justify-between">
							<span>ID:</span>
							<span className="max-w-24 truncate font-mono text-xs">
								{source.id}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
