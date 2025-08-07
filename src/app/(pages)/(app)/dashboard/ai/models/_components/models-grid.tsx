"use client";

import { Model } from "@prisma/client";
import ModelCard from "./model-card";

interface ModelsGridProps {
	models: Model[];
}

export default function ModelsGrid({ models }: ModelsGridProps) {
	if (models.length === 0) {
		return (
			<div className="rounded-lg border border-dashed p-8 text-center">
				<p className="text-muted-foreground">No models found</p>
				<p className="text-muted-foreground mt-1 text-sm">
					Try adjusting your search or create a new model.
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{models.map((model) => (
				<ModelCard key={model.id} model={model} />
			))}
		</div>
	);
}
