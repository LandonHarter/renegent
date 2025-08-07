"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Prompt } from "@prisma/client";

type SortOption =
	| "createdAt-desc"
	| "createdAt-asc"
	| "updatedAt-desc"
	| "updatedAt-asc";
type ViewMode = "grid" | "list";

interface PromptsContextType {
	// Search state
	searchQuery: string;
	setSearchQuery: (query: string) => void;

	// Sort state
	sortBy: SortOption;
	setSortBy: (sort: SortOption) => void;

	// View state
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;

	// Filtered and sorted prompts
	filteredPrompts: Prompt[];
	setPrompts: (prompts: Prompt[]) => void;
}

const PromptsContext = createContext<PromptsContextType | undefined>(undefined);

export function usePromptsContext() {
	const context = useContext(PromptsContext);
	if (!context) {
		throw new Error(
			"usePromptsContext must be used within a PromptsProvider"
		);
	}
	return context;
}

interface PromptsProviderProps {
	children: ReactNode;
	initialPrompts: Prompt[];
}

export function PromptsProvider({
	children,
	initialPrompts,
}: PromptsProviderProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<SortOption>("createdAt-desc");
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);

	// Filter and sort prompts based on current state
	const filteredPrompts = prompts
		.filter((prompt) => {
			if (!searchQuery) return true;
			const query = searchQuery.toLowerCase();
			return (
				prompt.name.toLowerCase().includes(query) ||
				prompt.prompt.toLowerCase().includes(query) ||
				prompt.variables.some((variable) =>
					variable.toLowerCase().includes(query)
				)
			);
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "createdAt-desc":
					return (
						new Date(b.createdAt).getTime() -
						new Date(a.createdAt).getTime()
					);
				case "createdAt-asc":
					return (
						new Date(a.createdAt).getTime() -
						new Date(b.createdAt).getTime()
					);
				case "updatedAt-desc":
					return (
						new Date(b.updatedAt).getTime() -
						new Date(a.updatedAt).getTime()
					);
				case "updatedAt-asc":
					return (
						new Date(a.updatedAt).getTime() -
						new Date(b.updatedAt).getTime()
					);
				default:
					return 0;
			}
		});

	return (
		<PromptsContext.Provider
			value={{
				searchQuery,
				setSearchQuery,
				sortBy,
				setSortBy,
				viewMode,
				setViewMode,
				filteredPrompts,
				setPrompts,
			}}
		>
			{children}
		</PromptsContext.Provider>
	);
}
