"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useKnowledgeBasesContext } from "../_context/knowledge-bases-context";

const sortOptions = [
	{ value: "createdAt-desc", label: "Newest First" },
	{ value: "createdAt-asc", label: "Oldest First" },
	{ value: "updatedAt-desc", label: "Recently Updated" },
	{ value: "updatedAt-asc", label: "Least Recently Updated" },
] as const;

export default function KnowledgeBasesSort() {
	const { sortBy, setSortBy } = useKnowledgeBasesContext();

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
