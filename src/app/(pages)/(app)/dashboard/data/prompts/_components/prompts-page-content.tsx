"use client";

import { usePromptsContext } from "../_context/prompts-context";
import PromptsControls from "./prompts-controls";
import PromptsGrid from "./prompts-grid";
import PromptsTable from "./prompts-table";

export default function PromptsPageContent() {
	const { viewMode, filteredPrompts } = usePromptsContext();

	return (
		<div className="space-y-6">
			<PromptsControls />

			{viewMode === "grid" ? (
				<PromptsGrid prompts={filteredPrompts} />
			) : (
				<PromptsTable prompts={filteredPrompts} />
			)}
		</div>
	);
}
