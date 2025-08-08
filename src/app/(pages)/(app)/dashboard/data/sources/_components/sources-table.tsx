"use client";

import { DataSource } from "@prisma/client";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Database, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface SourcesTableProps {
	sources: DataSource[];
}

export default function SourcesTable({ sources }: SourcesTableProps) {
	const router = useRouter();

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	if (sources.length === 0) {
		return (
			<div className="rounded-lg border border-dashed p-8 text-center">
				<p className="text-muted-foreground">No sources found</p>
				<p className="text-muted-foreground mt-1 text-sm">
					Try adjusting your search or create a new source.
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
						<TableHead>Type</TableHead>
						<TableHead>ID</TableHead>
						<TableHead>Created</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sources.map((source) => {
						return (
							<TableRow
								key={source.id}
								className="hover:bg-accent/50 cursor-pointer"
								onClick={() =>
									router.push(
										`/dashboard/data/sources/${source.id}`
									)
								}
							>
								<TableCell>
									<div className="flex items-center gap-3">
										<div className="bg-background flex h-6 w-6 items-center justify-center rounded border">
											<Database className="text-muted-foreground h-3 w-3" />
										</div>
										<span className="font-medium">
											{source.name}
										</span>
									</div>
								</TableCell>
								<TableCell>
									<Badge
										variant="secondary"
										className="text-xs"
									>
										<FileText className="mr-1 h-3 w-3" />
										Document
									</Badge>
								</TableCell>
								<TableCell className="font-mono text-sm">
									{source.id}
								</TableCell>
								<TableCell className="text-muted-foreground text-sm">
									{formatDate(source.createdAt)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
