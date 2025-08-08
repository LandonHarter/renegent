"use client";

import { DataSource } from "@prisma/client";
import SourceCard from "./source-card";

interface SourcesGridProps {
	sources: DataSource[];
}

export default function SourcesGrid({ sources }: SourcesGridProps) {
	if (sources.length === 0) {
		return (
			<div className="rounded-lg border border-dashed p-8 text-center">
				<p className="text-muted-foreground">No sources found</p>
				<p className="text-muted-foreground mt-1 text-sm">
					Try adjusting your search or create a new source.
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{sources.map((source) => (
				<SourceCard key={source.id} source={source} />
			))}
		</div>
	);
}
