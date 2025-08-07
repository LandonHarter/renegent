"use client";

import { useModelsContext } from "../_context/models-context";
import ModelsControls from "./models-controls";
import ModelsGrid from "./models-grid";
import ModelsTable from "./models-table";

export default function ModelsPageContent() {
	const { viewMode, filteredModels } = useModelsContext();

	return (
		<div className="space-y-6">
			<ModelsControls />

			{viewMode === "grid" ? (
				<ModelsGrid models={filteredModels} />
			) : (
				<ModelsTable models={filteredModels} />
			)}
		</div>
	);
}
