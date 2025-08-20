"use client";

import Image from "next/image";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getProvider } from "@/data/models";
import { usePlayground } from "../_context/playground-context";

export default function PlaygroundSidebar() {
	const {
		models,
		prompts,
		selectedModelId,
		selectedPromptId,
		selectedModel,
		disabled,
		setSelectedModelId,
		setSelectedPromptId,
	} = usePlayground();

	const selectedProvider = selectedModel
		? getProvider(selectedModel.provider)
		: null;

	return (
		<div className="bg-card border-border flex w-80 flex-col gap-6 border-r p-4">
			<div className="space-y-2">
				<h3 className="text-foreground text-sm font-medium">Model</h3>
				<Select
					value={selectedModelId}
					onValueChange={setSelectedModelId}
					disabled={disabled}
				>
					<SelectTrigger className="w-full">
						<SelectValue
							placeholder={
								disabled
									? "Configure API keys first"
									: "Select a model"
							}
						/>
					</SelectTrigger>
					<SelectContent>
						{models.map((model) => {
							const provider = getProvider(model.provider);
							return (
								<SelectItem
									key={model.id}
									value={model.modelId}
								>
									<div className="flex items-center gap-2">
										{provider && (
											<Image
												src={provider.icon}
												alt={provider.name}
												width={16}
												height={16}
												className="flex-shrink-0"
											/>
										)}
										<span>{model.name}</span>
									</div>
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-2">
				<h3 className="text-foreground text-sm font-medium">Prompt</h3>
				<Select
					value={selectedPromptId}
					onValueChange={setSelectedPromptId}
					disabled={disabled}
				>
					<SelectTrigger className="w-full">
						<SelectValue
							placeholder={
								disabled
									? "Configure API keys first"
									: "Select a prompt"
							}
						/>
					</SelectTrigger>
					<SelectContent>
						{prompts.map((prompt) => (
							<SelectItem key={prompt.id} value={prompt.promptId}>
								{prompt.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{selectedModel && (
				<div className="border-border space-y-2 border-t pt-4">
					<h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
						Model Details
					</h4>
					<div className="space-y-1 text-xs">
						<div className="flex justify-between">
							<span className="text-muted-foreground">
								Provider:
							</span>
							<span className="text-foreground">
								{selectedProvider?.name}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">
								Model ID:
							</span>
							<span className="text-foreground font-mono">
								{selectedModel.modelId}
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
