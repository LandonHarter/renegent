"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePromptsContext } from "../_context/prompts-context";

const sortOptions = [
	{ value: "createdAt-desc", label: "Newest First" },
	{ value: "createdAt-asc", label: "Oldest First" },
	{ value: "updatedAt-desc", label: "Recently Updated" },
	{ value: "updatedAt-asc", label: "Least Recently Updated" },
] as const;

export default function PromptsSort() {
	const { sortBy, setSortBy } = usePromptsContext();

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
