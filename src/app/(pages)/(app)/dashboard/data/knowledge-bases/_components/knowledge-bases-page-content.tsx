"use client";

import { useKnowledgeBasesContext } from "../_context/knowledge-bases-context";
import KnowledgeBasesControls from "./knowledge-bases-controls";
import KnowledgeBasesGrid from "./knowledge-bases-grid";
import KnowledgeBasesTable from "./knowledge-bases-table";

export default function KnowledgeBasesPageContent() {
	const { viewMode, filteredKnowledgeBases } = useKnowledgeBasesContext();

	return (
		<div className="space-y-6">
			<KnowledgeBasesControls />

			{viewMode === "grid" ? (
				<KnowledgeBasesGrid knowledgeBases={filteredKnowledgeBases} />
			) : (
				<KnowledgeBasesTable knowledgeBases={filteredKnowledgeBases} />
			)}
		</div>
	);
}
