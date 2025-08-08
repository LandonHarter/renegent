"use client";

import { KnowledgeBase } from "@prisma/client";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Database } from "lucide-react";
import { useRouter } from "next/navigation";

interface KnowledgeBasesTableProps {
	knowledgeBases: KnowledgeBase[];
}

export default function KnowledgeBasesTable({
	knowledgeBases,
}: KnowledgeBasesTableProps) {
	const router = useRouter();

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	if (knowledgeBases.length === 0) {
		return (
			<div className="rounded-lg border border-dashed p-8 text-center">
				<p className="text-muted-foreground">
					No knowledge bases found
				</p>
				<p className="text-muted-foreground mt-1 text-sm">
					Try adjusting your search or create a new knowledge base.
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
						<TableHead>Description</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Updated</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{knowledgeBases.map((knowledgeBase) => (
						<TableRow
							key={knowledgeBase.id}
							className="hover:bg-accent/50 cursor-pointer"
							onClick={() => {
								router.push(
									`/dashboard/data/knowledge-bases/${knowledgeBase.id}`
								);
							}}
						>
							<TableCell>
								<div className="flex items-center gap-3">
									<div className="bg-background flex h-6 w-6 items-center justify-center rounded border">
										<Database className="text-muted-foreground h-3 w-3" />
									</div>
									<span className="font-medium">
										{knowledgeBase.name}
									</span>
								</div>
							</TableCell>
							<TableCell className="max-w-md">
								<span className="text-muted-foreground text-sm">
									Centralized knowledge storage for AI
									interactions
								</span>
							</TableCell>
							<TableCell>
								<Badge variant="outline" className="text-xs">
									Active
								</Badge>
							</TableCell>
							<TableCell className="text-muted-foreground text-sm">
								{formatDate(knowledgeBase.createdAt)}
							</TableCell>
							<TableCell className="text-muted-foreground text-sm">
								{formatDate(knowledgeBase.updatedAt)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
