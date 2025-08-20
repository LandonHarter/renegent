"use client";

import { PlaygroundProvider } from "../_context/playground-context";
import PlaygroundSidebar from "./playground-sidebar";
import PlaygroundMessages from "./playground-messages";
import PlaygroundInput from "./playground-input";

// Re-export types for backward compatibility
export interface Model {
	id: string;
	name: string;
	modelId: string;
	provider: string;
	providerModelId: string;
}

export interface Prompt {
	id: string;
	name: string;
	promptId: string;
	prompt: string;
	variables: string[];
}

export interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

interface PlaygroundLayoutProps {
	models: Model[];
	prompts: Prompt[];
	disabled?: boolean;
	apiKey?: string;
}

function PlaygroundContent() {
	return (
		<div className="flex h-full min-h-[calc(100vh-10rem)] overflow-hidden">
			<PlaygroundSidebar />
			<div className="flex flex-1 flex-col">
				<PlaygroundMessages className="flex-1" />
				<PlaygroundInput />
			</div>
		</div>
	);
}

export default function PlaygroundLayout({
	models,
	prompts,
	disabled = false,
	apiKey,
}: PlaygroundLayoutProps) {
	return (
		<PlaygroundProvider
			models={models}
			prompts={prompts}
			disabled={disabled}
			apiKey={apiKey}
		>
			<PlaygroundContent />
		</PlaygroundProvider>
	);
}
