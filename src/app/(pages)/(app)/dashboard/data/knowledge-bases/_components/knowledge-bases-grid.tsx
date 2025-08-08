"use client";

import { KnowledgeBase } from "@prisma/client";
import KnowledgeBaseCard from "./knowledge-base-card";

interface KnowledgeBasesGridProps {
	knowledgeBases: KnowledgeBase[];
}

export default function KnowledgeBasesGrid({
	knowledgeBases,
}: KnowledgeBasesGridProps) {
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
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{knowledgeBases.map((knowledgeBase) => (
				<KnowledgeBaseCard
					key={knowledgeBase.id}
					knowledgeBase={knowledgeBase}
				/>
			))}
		</div>
	);
}
