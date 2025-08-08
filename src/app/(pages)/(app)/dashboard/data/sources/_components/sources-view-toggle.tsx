"use client";

import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";
import { useSourcesContext } from "../_context/sources-context";

export default function SourcesViewToggle() {
	const { viewMode, setViewMode } = useSourcesContext();

	return (
		<div className="flex items-center rounded-lg border p-1">
			<Button
				variant={viewMode === "grid" ? "default" : "ghost"}
				size="sm"
				onClick={() => setViewMode("grid")}
				className="h-8 px-3"
			>
				<Grid3X3 className="h-4 w-4" />
			</Button>
			<Button
				variant={viewMode === "list" ? "default" : "ghost"}
				size="sm"
				onClick={() => setViewMode("list")}
				className="h-8 px-3"
			>
				<List className="h-4 w-4" />
			</Button>
		</div>
	);
}
