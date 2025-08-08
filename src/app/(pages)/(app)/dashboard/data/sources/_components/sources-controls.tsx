"use client";

import SourcesSearch from "./sources-search";
import SourcesSort from "./sources-sort";
import SourcesViewToggle from "./sources-view-toggle";

export default function SourcesControls() {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<SourcesSearch />
			<div className="flex items-center gap-2">
				<SourcesSort />
				<SourcesViewToggle />
			</div>
		</div>
	);
}
