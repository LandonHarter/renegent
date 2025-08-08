export type ProviderObject = {
	id: string;
	name: string;
	icon: string;
	models: ModelType[];
};

export type ModelType = {
	id: string;
	name: string;
	description?: string;
};

export const PROVIDERS = [
	{
		id: "openai",
		name: "OpenAI",
		icon: "/providers/openai.svg",
		models: [
			{
				id: "gpt-5",
				name: "GPT-5",
			},
			{
				id: "gpt-5-mini",
				name: "GPT-5 Mini",
			},
			{
				id: "gpt-5-nano",
				name: "GPT-5 Nano",
			},
			{
				id: "gpt-4.1",
				name: "GPT-4.1",
			},
			{
				id: "gpt-4.1-mini",
				name: "GPT-4.1 Mini",
			},
			{
				id: "gpt-4.1-nano",
				name: "GPT-4.1 Nano",
			},
			{
				id: "gpt-4o",
				name: "GPT-4o",
			},
			{
				id: "gpt-4o-mini",
				name: "GPT-4o Mini",
			},
			{
				id: "o1",
				name: "o1",
			},
			{
				id: "o1-mini",
				name: "o1 Mini",
			},
			{
				id: "o3",
				name: "o3",
			},
			{
				id: "o3-mini",
				name: "o3 Mini",
			},
			{
				id: "o4-mini",
				name: "o4 Mini",
			},
		],
	},
	{
		id: "anthropic",
		name: "Anthropic",
		icon: "/providers/anthropic.svg",
		models: [
			{
				id: "claude-sonnet-4-20250514",
				name: "Claude Sonnet 4",
			},
			{
				id: "claude-opus-4-20250514",
				name: "Claude Opus 4",
			},
			{
				id: "claude-3-7-sonnet-20250219",
				name: "Claude 3.7 Sonnet",
			},
			{
				id: "claude-3-5-sonnet-20241022",
				name: "Claude 3.5 Sonnet",
			},
			{
				id: "claude-3-5-haiku-20241022",
				name: "Claude 3.5 Haiku",
			},
			{
				id: "claude-3-opus-20240229",
				name: "Claude 3 Opus",
			},
			{
				id: "claude-3-sonnet-20240229",
				name: "Claude 3 Sonnet",
			},
			{
				id: "claude-3-haiku-20240307",
				name: "Claude 3 Haiku",
			},
		],
	},
	{
		id: "google",
		name: "Google",
		icon: "/providers/google.svg",
		models: [
			{
				id: "gemini-2.5-pro",
				name: "Gemini 2.5 Pro",
			},
			{
				id: "gemini-2.5-flash",
				name: "Gemini 2.5 Flash",
			},
			{
				id: "gemini-2.5-flash-lite",
				name: "Gemini 2.5 Flash Lite",
			},
			{
				id: "gemini-2.0-flash",
				name: "Gemini 2.0 Flash",
			},
			{
				id: "gemini-1.5-pro",
				name: "Gemini 1.5 Pro",
			},
			{
				id: "gemini-1.5-flash",
				name: "Gemini 1.5 Flash",
			},
		],
	},
	{
		id: "azure",
		name: "Azure",
		icon: "/providers/azure.svg",
		models: [
			{
				id: "gpt-4o",
				name: "GPT-4o",
			},
		],
	},
	{
		id: "xai",
		name: "XAI",
		icon: "/providers/xai.svg",
		models: [
			{
				id: "grok-4",
				name: "Grok 4",
			},
			{
				id: "grok-3",
				name: "Grok 3",
			},
			{
				id: "grok-3-fast",
				name: "Grok 3 Fast",
			},
			{
				id: "grok-3-mini",
				name: "Grok 3 Mini",
			},
			{
				id: "grok-3-mini-fast",
				name: "Grok 3 Mini Fast",
			},
			{
				id: "grok-2",
				name: "Grok 2",
			},
			{
				id: "grok-beta",
				name: "Grok Beta",
			},
		],
	},
	{
		id: "deepseek",
		name: "DeepSeek",
		icon: "/providers/deepseek.svg",
		models: [
			{
				id: "deepseek-chat",
				name: "DeepSeek Chat",
			},
			{
				id: "deepseek-reasoner",
				name: "DeepSeek Reasoner",
			},
		],
	},
	{
		id: "perplexity",
		name: "Perplexity",
		icon: "/providers/perplexity.svg",
		models: [
			{
				id: "sonar-deep-research",
				name: "Sonar Deep Research",
			},
			{
				id: "sonar-reasoning-pro",
				name: "Sonar Reasoning Pro",
			},
			{
				id: "sonar-reasoning",
				name: "Sonar Reasoning",
			},
			{
				id: "sonar-pro",
				name: "Sonar Pro",
			},
			{
				id: "sonar",
				name: "Sonar",
			},
		],
	},
] as ProviderObject[];

export function getProvider(id: string) {
	return PROVIDERS.find((provider) => provider.id === id.toLowerCase());
}
