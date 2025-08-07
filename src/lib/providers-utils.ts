import { Providers } from "@prisma/client";

export function hasConfiguredProviders(
	providers: Providers | null | undefined
): boolean {
	if (!providers) return false;
	const apiKeys = [
		providers.openaiApiKey,
		providers.anthropicApiKey,
		providers.googleGenApiKey,
		providers.azureApiKey,
		providers.xApiKey,
		providers.deepseekApiKey,
		providers.perplexityApiKey,
	];

	// Return true if at least one API key is configured
	return apiKeys.some((key) => key && key.trim().length > 0);
}

export function getConfiguredProviders(
	providers: Providers | null | undefined
): string[] {
	if (!providers) return [];

	const configuredProviders: string[] = [];

	if (providers.openaiApiKey?.trim()) configuredProviders.push("OpenAI");
	if (providers.anthropicApiKey?.trim())
		configuredProviders.push("Anthropic");
	if (providers.googleGenApiKey?.trim())
		configuredProviders.push("Google Gemini");
	if (providers.azureApiKey?.trim()) configuredProviders.push("Azure OpenAI");
	if (providers.xApiKey?.trim()) configuredProviders.push("xAI");
	if (providers.deepseekApiKey?.trim()) configuredProviders.push("DeepSeek");
	if (providers.perplexityApiKey?.trim())
		configuredProviders.push("Perplexity");

	return configuredProviders;
}

export function getConfiguredProvidersCount(
	providers: Providers | null | undefined
): number {
	return getConfiguredProviders(providers).length;
}
