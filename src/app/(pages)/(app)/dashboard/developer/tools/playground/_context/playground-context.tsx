"use client";

import {
	createContext,
	useContext,
	useState,
	useCallback,
	ReactNode,
} from "react";

// Re-export types from components for consistency
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
	isLoading?: boolean;
}

interface PlaygroundContextValue {
	// Models and prompts data
	models: Model[];
	prompts: Prompt[];

	// Selected items
	selectedModelId?: string;
	selectedPromptId?: string;
	selectedModel?: Model;
	selectedPrompt?: Prompt;

	// Messages
	messages: Message[];

	// State
	disabled: boolean;
	isConfigured: boolean;
	isLoading: boolean;
	apiKey?: string;

	// Actions
	setSelectedModelId: (modelId: string) => void;
	setSelectedPromptId: (promptId: string) => void;
	sendMessage: (content: string) => void;
	clearMessages: () => void;
}

const PlaygroundContext = createContext<PlaygroundContextValue | undefined>(
	undefined
);

interface PlaygroundProviderProps {
	children: ReactNode;
	models: Model[];
	prompts: Prompt[];
	disabled?: boolean;
	apiKey?: string;
}

export function PlaygroundProvider({
	children,
	models,
	prompts,
	disabled = false,
	apiKey,
}: PlaygroundProviderProps) {
	const [selectedModelId, setSelectedModelId] = useState<
		string | undefined
	>();
	const [selectedPromptId, setSelectedPromptId] = useState<
		string | undefined
	>();
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	// Derived state
	const selectedModel = models.find((m) => m.id === selectedModelId);
	const selectedPrompt = prompts.find((p) => p.id === selectedPromptId);
	const isConfigured =
		!!selectedModelId && !!selectedPromptId && !disabled && !!apiKey;

	const sendMessage = useCallback(
		async (content: string) => {
			if (!selectedModelId || !selectedPromptId || isLoading || !apiKey)
				return;

			const userMessage: Message = {
				id: crypto.randomUUID(),
				role: "user",
				content,
				timestamp: new Date(),
			};

			// Add user message immediately
			setMessages((prev) => [...prev, userMessage]);

			// Add loading message
			const loadingMessageId = crypto.randomUUID();
			const loadingMessage: Message = {
				id: loadingMessageId,
				role: "assistant",
				content: "",
				timestamp: new Date(),
				isLoading: true,
			};

			setMessages((prev) => [...prev, loadingMessage]);
			setIsLoading(true);

			try {
				// Prepare messages for API call (exclude loading message)
				const currentMessages = [...messages, userMessage];
				const apiMessages = currentMessages.map((msg) => ({
					content: msg.content,
					role: msg.role as "user" | "assistant" | "system",
				}));

				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/v1/chat/completions`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${apiKey}`,
						},
						body: JSON.stringify({
							messages: apiMessages,
							model: selectedModelId,
							prompt: selectedPromptId,
						}),
					}
				);

				if (!response.ok) {
					throw new Error(
						`API request failed: ${response.statusText}`
					);
				}

				const data = await response.json();
				console.log(JSON.stringify(data, null, 2));
				const aiContent = data.steps[0].content.filter(
					(content: any) => content.type === "text"
				)[0].text;

				// Replace loading message with actual response
				setMessages((prev) =>
					prev.map((msg) =>
						msg.id === loadingMessageId
							? {
									...msg,
									content: aiContent,
									isLoading: false,
								}
							: msg
					)
				);
			} catch (error) {
				console.error("Error sending message:", error);

				// Replace loading message with error message
				setMessages((prev) =>
					prev.map((msg) =>
						msg.id === loadingMessageId
							? {
									...msg,
									content:
										"Sorry, there was an error processing your request. Please try again.",
									isLoading: false,
								}
							: msg
					)
				);
			} finally {
				setIsLoading(false);
			}
		},
		[selectedModelId, selectedPromptId, messages, isLoading, apiKey]
	);

	const clearMessages = useCallback(() => {
		setMessages([]);
	}, []);

	const value: PlaygroundContextValue = {
		models,
		prompts,
		selectedModelId,
		selectedPromptId,
		selectedModel,
		selectedPrompt,
		messages,
		disabled,
		isConfigured,
		isLoading,
		apiKey,
		setSelectedModelId,
		setSelectedPromptId,
		sendMessage,
		clearMessages,
	};

	return (
		<PlaygroundContext.Provider value={value}>
			{children}
		</PlaygroundContext.Provider>
	);
}

export function usePlayground() {
	const context = useContext(PlaygroundContext);
	if (context === undefined) {
		throw new Error(
			"usePlayground must be used within a PlaygroundProvider"
		);
	}
	return context;
}
