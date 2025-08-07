"use client";

import PromptsSearch from "./prompts-search";
import PromptsSort from "./prompts-sort";
import PromptsViewToggle from "./prompts-view-toggle";

export default function PromptsControls() {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<PromptsSearch />
			<div className="flex items-center gap-2">
				<PromptsSort />
				<PromptsViewToggle />
			</div>
		</div>
	);
}
