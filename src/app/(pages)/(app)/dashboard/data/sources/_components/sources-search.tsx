"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSourcesContext } from "../_context/sources-context";

export default function SourcesSearch() {
	const { searchQuery, setSearchQuery } = useSourcesContext();

	return (
		<div className="relative w-full max-w-sm">
			<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
			<Input
				placeholder="Search sources..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="pl-9"
			/>
		</div>
	);
}
