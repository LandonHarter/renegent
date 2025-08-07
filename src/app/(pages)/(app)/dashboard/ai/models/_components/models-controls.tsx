"use client";

import ModelsSearch from "./models-search";
import ModelsSort from "./models-sort";
import ModelsViewToggle from "./models-view-toggle";

export default function ModelsControls() {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<ModelsSearch />
			<div className="flex items-center gap-2">
				<ModelsSort />
				<ModelsViewToggle />
			</div>
		</div>
	);
}
