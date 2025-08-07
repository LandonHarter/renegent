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
				id: "gpt-4o",
				name: "GPT-4o",
			},
			{
				id: "gpt-4o-mini",
				name: "GPT-4o Mini",
			},
		],
	},
	{
		id: "anthropic",
		name: "Anthropic",
		icon: "/providers/anthropic.svg",
		models: [
			{
				id: "claude-4-sonnet-latest",
				name: "Claude 4 Sonnet",
			},
		],
	},
	{
		id: "google",
		name: "Google",
		icon: "/providers/google.svg",
		models: [
			{
				id: "gemini-2.0-flash-exp",
				name: "Gemini 2.0 Flash Exp",
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
				id: "grok-4-latest",
				name: "Grok 4",
			},
		],
	},
	{
		id: "deepseek",
		name: "DeepSeek",
		icon: "/providers/deepseek.svg",
		models: [
			{
				id: "deepseek-r1-distill-qwen-32b",
				name: "DeepSeek R1 Distill Qwen 32B",
			},
		],
	},
	{
		id: "perplexity",
		name: "Perplexity",
		icon: "/providers/perplexity.svg",
		models: [
			{
				id: "perplexity-4-latest",
				name: "Perplexity 4",
			},
		],
	},
] as ProviderObject[];

export function getProvider(id: string) {
	return PROVIDERS.find((provider) => provider.id === id.toLowerCase());
}
