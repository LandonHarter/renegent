"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Bot, Settings2, Check, Database, BookOpen } from "lucide-react";
import { trpcClient } from "@/trpc/client";
import { toast } from "sonner";
import { ModelType, ProviderObject, PROVIDERS } from "@/data/models";
import Image from "next/image";
import { Provider, Model, KnowledgeBase } from "@prisma/client";
import Form, { SubmitButton } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

// Map frontend provider IDs to backend enum values
const PROVIDER_MAPPING: Record<string, Provider> = {
	openai: "OPENAI",
	anthropic: "ANTHROPIC",
	google: "GOOGLE_GEN",
	azure: "AZURE",
	xai: "X",
	deepseek: "DEEPSEEK",
	perplexity: "PERPLEXITY",
};

interface ModelCreationFormProps {
	className?: string;
	hasProviders?: boolean;
	existingModels?: Model[];
	knowledgeBases?: KnowledgeBase[];
}

export default function ModelCreationForm({
	className = "",
	hasProviders = true,
	existingModels = [],
	knowledgeBases = [],
}: ModelCreationFormProps) {
	const router = useRouter();
	const [selectedProvider, setSelectedProvider] = useState("");
	const [selectedProviderModel, setSelectedProviderModel] = useState("");
	const [modelIdError, setModelIdError] = useState("");
	const [modelName, setModelName] = useState("");
	const [modelId, setModelId] = useState("");
	const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<
		string[]
	>([]);

	const [provider, setProvider] = useState<ProviderObject | undefined>();
	const [availableModels, setAvailableModels] = useState<ModelType[]>([]);

	useEffect(() => {
		if (selectedProvider) {
			const p = PROVIDERS.find((p) => p.id === selectedProvider);
			setProvider(p);
			setAvailableModels(p?.models || []);
			setSelectedProviderModel(
				selectedProvider === "azure" ? "" : p?.models?.[0]?.id || ""
			);
		}
	}, [selectedProvider]);

	const handleProviderSelect = (providerId: string) => {
		setSelectedProvider(providerId);
		if (providerId === "azure") {
			setSelectedProviderModel("");
		} else {
			const p = PROVIDERS.find((p) => p.id === providerId);
			setSelectedProviderModel(p?.models?.[0]?.id || "");
		}
		setModelId("");
		setModelName("");
	};

	const validateModelId = (modelId: string) => {
		if (!modelId) {
			setModelIdError("");
			return false;
		}

		const isDuplicate = existingModels.some(
			(model) => model.modelId === modelId
		);
		if (isDuplicate) {
			setModelIdError("A model with this ID already exists");
			return false;
		}

		setModelIdError("");
		return true;
	};

	const toggleKnowledgeBase = (knowledgeBaseId: string) => {
		setSelectedKnowledgeBases((prev) =>
			prev.includes(knowledgeBaseId)
				? prev.filter((id) => id !== knowledgeBaseId)
				: [...prev, knowledgeBaseId]
		);
	};

	const handleFormSubmit = async (formData: FormData) => {
		const name = formData.get("name") as string;
		const modelId = formData.get("modelId") as string;

		if (!name || !modelId || !selectedProvider || !selectedProviderModel) {
			toast.error("Please fill in all required fields");
			return;
		}

		// Final validation check
		if (!validateModelId(modelId)) {
			toast.error("Please fix the model ID error before submitting");
			return;
		}

		try {
			const backendProvider = PROVIDER_MAPPING[selectedProvider];
			if (!backendProvider) {
				throw new Error("Invalid provider selected");
			}

			const model = await trpcClient.models.create.mutate({
				name,
				modelId,
				provider: backendProvider,
				providerModelId: selectedProviderModel,
				knowledgeBaseIds: selectedKnowledgeBases,
			});

			toast.success("Model created successfully!", {
				description: `${name} is now available for use.`,
			});

			router.push(`/dashboard/ai/model/${model.id}`);
		} catch (error: any) {
			toast.error("Failed to create model", {
				description: error?.message || "An unexpected error occurred",
			});
		}
	};

	return (
		<div className={cn("w-full", className)}>
			<Form
				action={handleFormSubmit}
				className="flex w-full flex-col gap-6"
			>
				{(formRef, loading, setLoading) => (
					<>
						{/* Model Name */}
						<div className="space-y-2">
							<Label
								htmlFor="name"
								className="flex items-center gap-2 text-sm font-medium"
							>
								<Bot className="h-4 w-4" />
								Model Name
							</Label>
							<Input
								id="name"
								name="name"
								placeholder="e.g., My Custom Model"
								className="h-11"
								value={modelName}
								onChange={(e) => setModelName(e.target.value)}
								disabled={!hasProviders}
							/>
							<p className="text-muted-foreground text-xs">
								A friendly name to identify your model
							</p>
						</div>

						{/* Model ID */}
						<div className="space-y-2">
							<Label
								htmlFor="modelId"
								className="flex items-center gap-2 text-sm font-medium"
							>
								<Settings2 className="h-4 w-4" />
								Model ID
							</Label>
							<Input
								id="modelId"
								name="modelId"
								placeholder="e.g., my-custom-model"
								className={cn(
									"h-11 font-mono",
									modelIdError &&
										"border-red-500 focus-visible:ring-red-500"
								)}
								disabled={!hasProviders}
								onChange={(e) => {
									const cleanValue = e.target.value
										.toLowerCase()
										.replace(/[^a-z0-9-]/g, "");
									e.target.value = cleanValue;
									validateModelId(cleanValue);
									setModelId(cleanValue);
								}}
							/>
							{modelIdError && (
								<p className="mt-1 text-xs text-red-500">
									{modelIdError}
								</p>
							)}
							<p className="text-muted-foreground text-xs">
								Unique identifier for API usage (lowercase,
								alphanumeric and dashes only)
							</p>
						</div>

						{/* Provider Selection Grid */}
						<div className="space-y-2">
							<Label className="text-sm font-medium">
								AI Provider
							</Label>
							<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
								{PROVIDERS.map((provider) => (
									<button
										key={provider.id}
										type="button"
										disabled={!hasProviders}
										onClick={() =>
											handleProviderSelect(provider.id)
										}
										className={cn(
											"hover:bg-muted/50 flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors",
											selectedProvider === provider.id
												? "bg-card border-primary"
												: "bg-card",
											!hasProviders &&
												"cursor-not-allowed opacity-50"
										)}
									>
										<Image
											src={provider.icon}
											alt={provider.name}
											width={32}
											height={32}
											className="rounded"
										/>
										<span className="text-sm font-medium">
											{provider.name}
										</span>
									</button>
								))}
							</div>
						</div>

						{/* Provider Model Selection */}
						{selectedProvider && selectedProvider !== "azure" && (
							<div className="space-y-2">
								<Label className="text-sm font-medium">
									Provider Model
								</Label>
								<Select
									value={selectedProviderModel}
									onValueChange={(e) => {
										if (!e) return;
										setSelectedProviderModel(e);
									}}
									disabled={!hasProviders}
								>
									<SelectTrigger className="bg-card h-12">
										<SelectValue>
											{selectedProviderModel ? (
												<div className="flex flex-col items-start">
													<span className="text-left font-medium">
														{
															provider?.models.find(
																(model) =>
																	model.id ===
																	selectedProviderModel
															)?.name
														}
													</span>
													<span className="text-muted-foreground text-left font-mono text-xs">
														{selectedProviderModel}
													</span>
												</div>
											) : (
												<span className="text-muted-foreground">
													Select a model
												</span>
											)}
										</SelectValue>
									</SelectTrigger>
									<SelectContent>
										{availableModels.map((model) => (
											<SelectItem
												key={model.id}
												value={model.id}
											>
												<div className="flex flex-col">
													<span className="font-medium">
														{model.name}
													</span>
													<span className="text-muted-foreground font-mono text-xs">
														{model.id}
													</span>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<p className="text-muted-foreground text-xs">
									The actual model from {provider?.name} that
									will be used
								</p>
							</div>
						)}
						{selectedProvider === "azure" && (
							<div className="space-y-2">
								<Label className="text-sm font-medium">
									Provider Model
								</Label>
								<Input
									placeholder="Enter your Azure deployment/model ID"
									className="h-11 font-mono"
									value={selectedProviderModel}
									onChange={(e) =>
										setSelectedProviderModel(
											e.target.value.trim()
										)
									}
									disabled={!hasProviders}
								/>
								<p className="text-muted-foreground text-xs">
									Enter the deployment name you configured in
									the Azure portal
								</p>
							</div>
						)}

						{/* Knowledge Base Selection */}
						<div className="space-y-2">
							<Label className="flex items-center gap-2 text-sm font-medium">
								<BookOpen className="h-4 w-4" />
								Knowledge Bases (Optional)
							</Label>

							{knowledgeBases.length === 0 ? (
								<Card className="border-dashed">
									<CardContent className="flex flex-col items-center justify-center py-6">
										<BookOpen className="text-muted-foreground mb-2 h-6 w-6" />
										<p className="text-muted-foreground text-center text-sm">
											No knowledge bases available.
											<br />
											<a
												href="/dashboard/data/knowledge-bases/create"
												className="text-primary hover:underline"
											>
												Create a knowledge base first
											</a>
										</p>
									</CardContent>
								</Card>
							) : (
								<div className="grid gap-3 md:grid-cols-2">
									{knowledgeBases.map((knowledgeBase) => (
										<button
											key={knowledgeBase.id}
											type="button"
											onClick={() =>
												toggleKnowledgeBase(
													knowledgeBase.id
												)
											}
											disabled={!hasProviders}
											className={cn(
												"hover:bg-muted/50 relative flex cursor-pointer flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors",
												selectedKnowledgeBases.includes(
													knowledgeBase.id
												)
													? "bg-card border-primary"
													: "bg-card",
												!hasProviders &&
													"cursor-not-allowed opacity-50"
											)}
										>
											{selectedKnowledgeBases.includes(
												knowledgeBase.id
											) && (
												<div className="absolute top-2 right-2">
													<Check className="text-primary h-4 w-4" />
												</div>
											)}
											<div className="flex items-center gap-2">
												<Database className="text-muted-foreground h-4 w-4" />
												<span className="text-sm font-medium">
													{knowledgeBase.name}
												</span>
											</div>
											<p className="text-muted-foreground text-xs">
												Created{" "}
												{new Date(
													knowledgeBase.createdAt
												).toLocaleDateString()}
											</p>
										</button>
									))}
								</div>
							)}
							<p className="text-muted-foreground text-xs">
								Attach knowledge bases to provide context for
								this AI model
							</p>
						</div>

						{/* Preview Card */}
						{selectedProvider && (
							<div className="bg-card space-y-2 rounded-lg border p-4">
								<div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
									<Check className="h-4 w-4" />
									Preview
								</div>
								<div className="space-y-3">
									<div className="flex items-center gap-3">
										{provider && (
											<Image
												src={provider.icon}
												alt={provider.name}
												width={32}
												height={32}
												className="rounded"
											/>
										)}
										<div>
											<p className="font-medium">
												{modelName || "Set a name..."}
											</p>
											<p className="text-muted-foreground font-mono text-sm">
												{selectedProviderModel ||
													"Select a model"}
											</p>
										</div>
									</div>
									{selectedKnowledgeBases.length > 0 && (
										<div className="space-y-2">
											<p className="text-muted-foreground text-sm font-medium">
												Knowledge Bases (
												{selectedKnowledgeBases.length})
											</p>
											<div className="flex flex-wrap gap-1">
												{selectedKnowledgeBases.map(
													(id) => {
														const kb =
															knowledgeBases.find(
																(kb) =>
																	kb.id === id
															);
														return kb ? (
															<span
																key={id}
																className="bg-muted rounded px-2 py-1 text-xs"
															>
																{kb.name}
															</span>
														) : null;
													}
												)}
											</div>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Submit Button */}
						<div className="flex justify-start">
							<SubmitButton
								loading={loading}
								setLoading={setLoading}
								formRef={formRef}
								disabled={
									!hasProviders ||
									!selectedProvider ||
									!selectedProviderModel ||
									!!modelIdError
								}
							>
								Create Model
							</SubmitButton>
						</div>
					</>
				)}
			</Form>
		</div>
	);
}
