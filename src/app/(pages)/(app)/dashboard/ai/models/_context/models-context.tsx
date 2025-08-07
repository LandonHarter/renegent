"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Model } from "@prisma/client";

type SortOption =
	| "createdAt-desc"
	| "createdAt-asc"
	| "updatedAt-desc"
	| "updatedAt-asc";
type ViewMode = "grid" | "list";

interface ModelsContextType {
	// Search state
	searchQuery: string;
	setSearchQuery: (query: string) => void;

	// Sort state
	sortBy: SortOption;
	setSortBy: (sort: SortOption) => void;

	// View state
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;

	// Filtered and sorted models
	filteredModels: Model[];
	setModels: (models: Model[]) => void;
}

const ModelsContext = createContext<ModelsContextType | undefined>(undefined);

export function useModelsContext() {
	const context = useContext(ModelsContext);
	if (!context) {
		throw new Error(
			"useModelsContext must be used within a ModelsProvider"
		);
	}
	return context;
}

interface ModelsProviderProps {
	children: ReactNode;
	initialModels: Model[];
}

export function ModelsProvider({
	children,
	initialModels,
}: ModelsProviderProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<SortOption>("createdAt-desc");
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const [models, setModels] = useState<Model[]>(initialModels);

	// Filter and sort models based on current state
	const filteredModels = models
		.filter((model) => {
			if (!searchQuery) return true;
			const query = searchQuery.toLowerCase();
			return (
				model.name.toLowerCase().includes(query) ||
				model.modelId.toLowerCase().includes(query) ||
				model.provider.toLowerCase().includes(query) ||
				model.providerModelId.toLowerCase().includes(query)
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
		<ModelsContext.Provider
			value={{
				searchQuery,
				setSearchQuery,
				sortBy,
				setSortBy,
				viewMode,
				setViewMode,
				filteredModels,
				setModels,
			}}
		>
			{children}
		</ModelsContext.Provider>
	);
}
