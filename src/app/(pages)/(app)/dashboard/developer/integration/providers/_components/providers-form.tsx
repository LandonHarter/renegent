"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { trpcClient } from "@/trpc/client";
import { toast } from "sonner";
import Image from "next/image";

interface ProviderConfig {
	id: string;
	name: string;
	icon: string;
	fields: Array<{
		key: string;
		label: string;
		type: "text" | "password";
		placeholder?: string;
	}>;
}

const PROVIDERS: ProviderConfig[] = [
	{
		id: "openai",
		name: "OpenAI",
		icon: "/providers/openai.svg",
		fields: [
			{
				key: "openaiApiKey",
				label: "API Key",
				type: "password",
				placeholder: "sk-...",
			},
			{
				key: "openaiBaseUrl",
				label: "Base URL",
				type: "text",
				placeholder: "https://api.openai.com/v1",
			},
		],
	},
	{
		id: "anthropic",
		name: "Anthropic",
		icon: "/providers/anthropic.svg",
		fields: [
			{
				key: "anthropicApiKey",
				label: "API Key",
				type: "password",
				placeholder: "sk-ant-...",
			},
			{
				key: "anthropicBaseUrl",
				label: "Base URL",
				type: "text",
				placeholder: "https://api.anthropic.com/v1",
			},
		],
	},
	{
		id: "google",
		name: "Google Gemini",
		icon: "/providers/google.svg",
		fields: [
			{
				key: "googleGenApiKey",
				label: "API Key",
				type: "password",
				placeholder: "AIza...",
			},
			{
				key: "googleGenBaseUrl",
				label: "Base URL",
				type: "text",
				placeholder: "https://generativelanguage.googleapis.com/v1beta",
			},
		],
	},
	{
		id: "azure",
		name: "Azure OpenAI",
		icon: "/providers/azure.svg",
		fields: [
			{
				key: "azureResourceName",
				label: "Resource Name",
				type: "text",
				placeholder: "your-resource-name",
			},
			{
				key: "azureApiKey",
				label: "API Key",
				type: "password",
				placeholder: "your-azure-api-key",
			},
		],
	},
	{
		id: "xai",
		name: "xAI",
		icon: "/providers/xai.svg",
		fields: [
			{
				key: "xApiKey",
				label: "API Key",
				type: "password",
				placeholder: "xai-...",
			},
			{
				key: "xBaseurl",
				label: "Base URL",
				type: "text",
				placeholder: "https://api.x.ai/v1",
			},
		],
	},
	{
		id: "deepseek",
		name: "DeepSeek",
		icon: "/providers/deepseek.svg",
		fields: [
			{
				key: "deepseekApiKey",
				label: "API Key",
				type: "password",
				placeholder: "sk-...",
			},
			{
				key: "deepseekBaseUrl",
				label: "Base URL",
				type: "text",
				placeholder: "https://api.deepseek.com/v1",
			},
		],
	},
	{
		id: "perplexity",
		name: "Perplexity",
		icon: "/providers/perplexity.svg",
		fields: [
			{
				key: "perplexityApiKey",
				label: "API Key",
				type: "password",
				placeholder: "pplx-...",
			},
			{
				key: "perplexityBaseUrl",
				label: "Base URL",
				type: "text",
				placeholder: "https://api.perplexity.ai",
			},
		],
	},
];

interface ProvidersFormProps {
	initialData: any;
}

export default function ProvidersForm({ initialData }: ProvidersFormProps) {
	const [formData, setFormData] = useState<Record<string, string>>({});
	const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
		{}
	);
	const [isAutoSaving, setIsAutoSaving] = useState(false);
	const [lastSaved, setLastSaved] = useState<Date | null>(null);
	const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (initialData) {
			const data: Record<string, string> = {};
			PROVIDERS.forEach((provider) => {
				provider.fields.forEach((field) => {
					const value =
						initialData[field.key as keyof typeof initialData];
					if (value) {
						data[field.key] = value as string;
					}
				});
			});
			setFormData(data);
		}
	}, [initialData]);

	const autoSave = useCallback(async (data: Record<string, string>) => {
		setIsAutoSaving(true);
		try {
			await trpcClient.providers.updateKeys.mutate(data);
			setLastSaved(new Date());
		} catch (error: any) {
			toast.error(
				`Failed to auto-save provider settings: ${error.message}`
			);
		} finally {
			setIsAutoSaving(false);
		}
	}, []);

	const handleInputChange = (key: string, value: string) => {
		const newFormData = {
			...formData,
			[key]: value,
		};
		setFormData(newFormData);

		// Clear existing timeout
		if (autoSaveTimeoutRef.current) {
			clearTimeout(autoSaveTimeoutRef.current);
		}

		// Set new timeout for auto-save (debounced by 1 second)
		autoSaveTimeoutRef.current = setTimeout(() => {
			autoSave(newFormData);
		}, 1000);
	};

	const togglePasswordVisibility = (fieldKey: string) => {
		setShowPasswords((prev) => ({
			...prev,
			[fieldKey]: !prev[fieldKey],
		}));
	};

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (autoSaveTimeoutRef.current) {
				clearTimeout(autoSaveTimeoutRef.current);
			}
		};
	}, []);

	return (
		<div className="mt-2 flex flex-col gap-4">
			{/* Auto-save status */}
			<div className="text-muted-foreground flex items-center gap-2 text-sm">
				{isAutoSaving ? (
					<>
						<Loader2 className="h-3 w-3 animate-spin" />
						<span>Auto-saving...</span>
					</>
				) : lastSaved ? (
					<>
						<Check className="h-3 w-3 text-green-500" />
						<span>
							Auto-saved at {lastSaved.toLocaleTimeString()}
						</span>
					</>
				) : null}
			</div>

			<Accordion type="multiple" className="w-full space-y-4">
				{PROVIDERS.map((provider) => (
					<AccordionItem
						key={provider.id}
						value={provider.id}
						className="rounded-lg border px-4"
					>
						<AccordionTrigger className="hover:no-underline">
							<div className="flex items-center gap-3">
								<Image
									src={provider.icon}
									alt={`${provider.name} logo`}
									width={24}
									height={24}
									className="dark:invert"
								/>
								<span className="font-medium">
									{provider.name}
								</span>
								{!provider.fields.some(
									(field) => !formData[field.key]
								) && (
									<div className="mr-4 ml-auto">
										<div className="h-2 w-2 rounded-full bg-green-500" />
									</div>
								)}
							</div>
						</AccordionTrigger>
						<AccordionContent className="space-y-4 px-2 pt-4 pb-6">
							{provider.fields.map((field) => (
								<div key={field.key} className="space-y-2">
									<Label htmlFor={field.key}>
										{field.label}
									</Label>
									<div className="relative">
										<Input
											id={field.key}
											type={
												field.type === "password" &&
												!showPasswords[field.key]
													? "password"
													: "text"
											}
											placeholder={field.placeholder}
											value={formData[field.key] || ""}
											onChange={(e) =>
												handleInputChange(
													field.key,
													e.target.value
												)
											}
											className="pr-10 font-mono text-sm"
										/>
										{field.type === "password" && (
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={() =>
													togglePasswordVisibility(
														field.key
													)
												}
											>
												{showPasswords[field.key] ? (
													<EyeOff className="text-muted-foreground h-4 w-4" />
												) : (
													<Eye className="text-muted-foreground h-4 w-4" />
												)}
												<span className="sr-only">
													{showPasswords[field.key]
														? "Hide"
														: "Show"}{" "}
													API key
												</span>
											</Button>
										)}
									</div>
								</div>
							))}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}
