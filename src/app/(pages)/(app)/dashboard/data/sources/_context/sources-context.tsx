"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { DataSource } from "@prisma/client";

type SortOption = "createdAt-desc" | "createdAt-asc" | "name-asc" | "name-desc";
type ViewMode = "grid" | "list";

interface SourcesContextType {
	// Search state
	searchQuery: string;
	setSearchQuery: (query: string) => void;

	// Sort state
	sortBy: SortOption;
	setSortBy: (sort: SortOption) => void;

	// View state
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;

	// Filtered and sorted sources
	filteredSources: DataSource[];
	setSources: (sources: DataSource[]) => void;
}

const SourcesContext = createContext<SourcesContextType | undefined>(undefined);

export function useSourcesContext() {
	const context = useContext(SourcesContext);
	if (!context) {
		throw new Error(
			"useSourcesContext must be used within a SourcesProvider"
		);
	}
	return context;
}

interface SourcesProviderProps {
	children: ReactNode;
	initialSources: DataSource[];
}

export function SourcesProvider({
	children,
	initialSources,
}: SourcesProviderProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<SortOption>("createdAt-desc");
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const [sources, setSources] = useState<DataSource[]>(initialSources);

	// Filter and sort sources based on current state
	const filteredSources = sources
		.filter((source) => {
			if (!searchQuery) return true;
			const query = searchQuery.toLowerCase();
			return source.name.toLowerCase().includes(query);
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
				case "name-asc":
					return a.name
						.toLowerCase()
						.localeCompare(b.name.toLowerCase());
				case "name-desc":
					return b.name
						.toLowerCase()
						.localeCompare(a.name.toLowerCase());
				default:
					return 0;
			}
		});

	return (
		<SourcesContext.Provider
			value={{
				searchQuery,
				setSearchQuery,
				sortBy,
				setSortBy,
				viewMode,
				setViewMode,
				filteredSources,
				setSources,
			}}
		>
			{children}
		</SourcesContext.Provider>
	);
}
