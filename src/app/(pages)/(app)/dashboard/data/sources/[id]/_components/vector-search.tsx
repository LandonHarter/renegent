"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, FileText } from "lucide-react";
import { trpcClient } from "@/trpc/client";

interface VectorSearchProps {
	sourceId: string;
}

interface SearchResult {
	id: string;
	content: string;
	embedding: number[];
}

export default function VectorSearch({ sourceId }: VectorSearchProps) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	const handleSearch = async () => {
		if (!query.trim()) return;

		setIsSearching(true);
		try {
			const searchResults = await trpcClient.vector.search.query({
				source: sourceId,
				query: query.trim(),
			});
			setResults(searchResults as SearchResult[]);
		} catch (error) {
			console.error("Search failed:", error);
		} finally {
			setIsSearching(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Search className="h-5 w-5" />
					Vector Search
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Search Input */}
				<div className="flex gap-2">
					<div className="relative flex-1">
						<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
						<Input
							placeholder="Search through this data source..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onKeyPress={handleKeyPress}
							className="pl-9"
							disabled={isSearching}
						/>
					</div>
					<Button
						onClick={handleSearch}
						disabled={isSearching || !query.trim()}
					>
						{isSearching ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Search className="h-4 w-4" />
						)}
					</Button>
				</div>

				{/* Search Results */}
				{results.length > 0 && (
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Badge variant="secondary">
								{results.length} result
								{results.length !== 1 ? "s" : ""}
							</Badge>
							<p className="text-muted-foreground text-sm">
								Showing the most relevant content for "{query}"
							</p>
						</div>

						<div className="max-h-96 space-y-3 overflow-y-auto">
							{results.map((result, index) => (
								<Card
									key={result.id || index}
									className="border-l-primary rounded-md border-l-4"
								>
									<CardContent className="pt-4">
										<div className="flex items-start gap-2">
											<FileText className="text-muted-foreground mt-1 h-4 w-4 flex-shrink-0" />
											<div className="min-w-0 flex-1">
												<p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
													{result.content}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				)}

				{/* No Results Message */}
				{results.length === 0 && query && !isSearching && (
					<div className="py-8 text-center">
						<Search className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
						<p className="text-muted-foreground">
							No results found for "{query}"
						</p>
						<p className="text-muted-foreground mt-1 text-sm">
							Try different keywords or check your spelling
						</p>
					</div>
				)}

				{/* Initial State */}
				{results.length === 0 && !query && !isSearching && (
					<div className="py-8 text-center">
						<Search className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
						<p className="text-muted-foreground">
							Search through this data source using semantic
							similarity
						</p>
						<p className="text-muted-foreground mt-1 text-sm">
							Enter a query above to find relevant content
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
