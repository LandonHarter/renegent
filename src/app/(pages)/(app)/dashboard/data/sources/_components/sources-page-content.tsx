"use client";

import { useSourcesContext } from "../_context/sources-context";
import SourcesControls from "./sources-controls";
import SourcesGrid from "./sources-grid";
import SourcesTable from "./sources-table";

export default function SourcesPageContent() {
	const { viewMode, filteredSources } = useSourcesContext();

	return (
		<div className="space-y-6">
			<SourcesControls />

			{viewMode === "grid" ? (
				<SourcesGrid sources={filteredSources} />
			) : (
				<SourcesTable sources={filteredSources} />
			)}
		</div>
	);
}
