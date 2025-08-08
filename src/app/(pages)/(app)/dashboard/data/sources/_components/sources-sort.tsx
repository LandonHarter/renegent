"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useSourcesContext } from "../_context/sources-context";

const sortOptions = [
	{ value: "createdAt-desc", label: "Newest First" },
	{ value: "createdAt-asc", label: "Oldest First" },
	{ value: "name-asc", label: "Name A-Z" },
	{ value: "name-desc", label: "Name Z-A" },
] as const;

export default function SourcesSort() {
	const { sortBy, setSortBy } = useSourcesContext();

	return (
		<Select value={sortBy} onValueChange={setSortBy}>
			<SelectTrigger className="w-48">
				<SelectValue placeholder="Sort by..." />
			</SelectTrigger>
			<SelectContent>
				{sortOptions.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
