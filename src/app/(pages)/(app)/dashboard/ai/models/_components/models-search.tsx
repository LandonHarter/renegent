"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useModelsContext } from "../_context/models-context";

export default function ModelsSearch() {
	const { searchQuery, setSearchQuery } = useModelsContext();

	return (
		<div className="relative w-full max-w-sm">
			<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
			<Input
				placeholder="Search models..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="pl-9"
			/>
		</div>
	);
}
