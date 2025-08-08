"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { KnowledgeBase } from "@prisma/client";

type SortOption =
	| "createdAt-desc"
	| "createdAt-asc"
	| "updatedAt-desc"
	| "updatedAt-asc";
type ViewMode = "grid" | "list";

interface KnowledgeBasesContextType {
	// Search state
	searchQuery: string;
	setSearchQuery: (query: string) => void;

	// Sort state
	sortBy: SortOption;
	setSortBy: (sort: SortOption) => void;

	// View state
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;

	// Filtered and sorted knowledge bases
	filteredKnowledgeBases: KnowledgeBase[];
	setKnowledgeBases: (knowledgeBases: KnowledgeBase[]) => void;
}

const KnowledgeBasesContext = createContext<
	KnowledgeBasesContextType | undefined
>(undefined);

export function useKnowledgeBasesContext() {
	const context = useContext(KnowledgeBasesContext);
	if (!context) {
		throw new Error(
			"useKnowledgeBasesContext must be used within a KnowledgeBasesProvider"
		);
	}
	return context;
}

interface KnowledgeBasesProviderProps {
	children: ReactNode;
	initialKnowledgeBases: KnowledgeBase[];
}

export function KnowledgeBasesProvider({
	children,
	initialKnowledgeBases,
}: KnowledgeBasesProviderProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<SortOption>("createdAt-desc");
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>(
		initialKnowledgeBases
	);

	// Filter and sort knowledge bases based on current state
	const filteredKnowledgeBases = knowledgeBases
		.filter((knowledgeBase) => {
			if (!searchQuery) return true;
			const query = searchQuery.toLowerCase();
			return knowledgeBase.name.toLowerCase().includes(query);
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
		<KnowledgeBasesContext.Provider
			value={{
				searchQuery,
				setSearchQuery,
				sortBy,
				setSortBy,
				viewMode,
				setViewMode,
				filteredKnowledgeBases,
				setKnowledgeBases,
			}}
		>
			{children}
		</KnowledgeBasesContext.Provider>
	);
}
