"use client";

import { Prompt } from "@prisma/client";
import PromptCard from "./prompt-card";

interface PromptsGridProps {
	prompts: Prompt[];
}

export default function PromptsGrid({ prompts }: PromptsGridProps) {
	if (prompts.length === 0) {
		return (
			<div className="rounded-lg border border-dashed p-8 text-center">
				<p className="text-muted-foreground">No prompts found</p>
				<p className="text-muted-foreground mt-1 text-sm">
					Try adjusting your search or create a new prompt.
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{prompts.map((prompt) => (
				<PromptCard key={prompt.id} prompt={prompt} />
			))}
		</div>
	);
}
