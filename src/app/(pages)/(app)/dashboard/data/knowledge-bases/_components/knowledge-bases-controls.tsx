"use client";

import KnowledgeBasesSearch from "./knowledge-bases-search";
import KnowledgeBasesSort from "./knowledge-bases-sort";
import KnowledgeBasesViewToggle from "./knowledge-bases-view-toggle";

export default function KnowledgeBasesControls() {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<KnowledgeBasesSearch />
			<div className="flex items-center gap-2">
				<KnowledgeBasesSort />
				<KnowledgeBasesViewToggle />
			</div>
		</div>
	);
}
