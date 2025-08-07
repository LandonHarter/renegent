"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Plus,
	X,
	FileText,
	Variable,
	Sparkles,
	Check,
	ArrowLeft,
} from "lucide-react";
import { trpcClient } from "@/trpc/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Prompt } from "@prisma/client";
import HighlightedTextarea from "../../../../prompts/create/_components/highlighted-textarea";

interface PromptEditFormProps {
	prompt: Prompt;
	className?: string;
}

export default function PromptEditForm({
	prompt,
	className = "",
}: PromptEditFormProps) {
	const router = useRouter();
	const [promptName, setPromptName] = useState(prompt.name);
	const [promptId, setPromptId] = useState(prompt.promptId);
	const [promptIdError, setPromptIdError] = useState("");
	const [promptText, setPromptText] = useState(prompt.prompt);
	const [variables, setVariables] = useState<string[]>(prompt.variables);
	const [newVariable, setNewVariable] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [lastSaved, setLastSaved] = useState<Date | null>(null);

	// Validate prompt ID
	const validatePromptId = (promptId: string) => {
		if (!promptId) {
			setPromptIdError("");
			return false;
		}

		// Basic validation - will be validated on server too
		if (!/^[a-z0-9-]+$/.test(promptId)) {
			setPromptIdError(
				"Only lowercase letters, numbers, and dashes allowed"
			);
			return false;
		}

		setPromptIdError("");
		return true;
	};

	// Auto-save function
	const autoSave = useCallback(async () => {
		if (!promptName || !promptId || !promptText || promptIdError) {
			return;
		}

		setIsSaving(true);
		try {
			await trpcClient.prompts.update.mutate({
				id: prompt.id,
				name: promptName,
				promptId,
				prompt: promptText,
				variables,
			});
			setLastSaved(new Date());
		} catch (error: any) {
			toast.error("Auto-save failed", {
				description:
					error?.message || "Changes will be retried automatically",
			});
		} finally {
			setIsSaving(false);
		}
	}, [prompt.id, promptName, promptId, promptText, variables, promptIdError]);

	// Auto-save effect with debouncing
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			autoSave();
		}, 1000); // Save after 1 second of inactivity

		return () => clearTimeout(timeoutId);
	}, [autoSave]);

	// Add a new variable
	const addVariable = () => {
		if (newVariable.trim() && !variables.includes(newVariable.trim())) {
			setVariables([...variables, newVariable.trim()]);
			setNewVariable("");
		}
	};

	// Remove a variable
	const removeVariable = (variableToRemove: string) => {
		setVariables(variables.filter((v) => v !== variableToRemove));
	};

	// Handle keyboard events for adding variables
	const handleVariableKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addVariable();
		}
	};

	const formatLastSaved = (date: Date) => {
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffSeconds = Math.floor(diffMs / 1000);

		if (diffSeconds < 10) return "Just now";
		if (diffSeconds < 60) return `${diffSeconds}s ago`;
		if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;

		return date.toLocaleTimeString();
	};

	return (
		<div className={cn("w-full", className)}>
			{/* Header with Stop Editing button and save status */}
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-3">
					{isSaving && (
						<div className="text-muted-foreground flex items-center gap-2 text-sm">
							<div className="h-3 w-3 animate-spin rounded-full border border-gray-300 border-t-gray-600"></div>
							Saving...
						</div>
					)}
					{lastSaved && !isSaving && (
						<div className="text-muted-foreground flex items-center gap-2 text-sm">
							<Check className="h-3 w-3 text-green-600" />
							Saved {formatLastSaved(lastSaved)}
						</div>
					)}
				</div>
				<Button
					variant="outline"
					onClick={() =>
						router.push(`/dashboard/data/prompt/${prompt.promptId}`)
					}
					className="flex items-center gap-2"
				>
					<ArrowLeft className="h-4 w-4" />
					Stop Editing
				</Button>
			</div>

			<div className="flex w-full flex-col gap-6">
				{/* Prompt Name */}
				<div className="space-y-2">
					<Label
						htmlFor="name"
						className="flex items-center gap-2 text-sm font-medium"
					>
						<FileText className="h-4 w-4" />
						Prompt Name
					</Label>
					<Input
						id="name"
						name="name"
						placeholder="e.g., Customer Support Email Template"
						className="h-11"
						value={promptName}
						onChange={(e) => setPromptName(e.target.value)}
					/>
					<p className="text-muted-foreground text-xs">
						A descriptive name to identify your prompt
					</p>
				</div>

				{/* Prompt ID */}
				<div className="space-y-2">
					<Label
						htmlFor="promptId"
						className="flex items-center gap-2 text-sm font-medium"
					>
						<Variable className="h-4 w-4" />
						Prompt ID
					</Label>
					<Input
						id="promptId"
						name="promptId"
						placeholder="e.g., customer-support-email"
						className={cn(
							"h-11 font-mono",
							promptIdError &&
								"border-red-500 focus-visible:ring-red-500"
						)}
						value={promptId}
						onChange={(e) => {
							const cleanValue = e.target.value
								.toLowerCase()
								.replace(/[^a-z0-9-]/g, "");
							setPromptId(cleanValue);
							validatePromptId(cleanValue);
						}}
					/>
					{promptIdError && (
						<p className="mt-1 text-xs text-red-500">
							{promptIdError}
						</p>
					)}
					<p className="text-muted-foreground text-xs">
						Unique identifier for API usage (lowercase, alphanumeric
						and dashes only)
					</p>
				</div>

				{/* Variables Management */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-base">
							<Variable className="h-4 w-4" />
							Variables
						</CardTitle>
						<p className="text-muted-foreground text-sm">
							Define variables that can be used in your prompt
							with {`{{variable_name}}`} syntax
						</p>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Add Variable Input */}
						<div className="flex gap-2">
							<Input
								placeholder="Enter variable name"
								value={newVariable}
								onChange={(e) => setNewVariable(e.target.value)}
								onKeyDown={handleVariableKeyDown}
								className="flex-1"
							/>
							<Button
								type="button"
								onClick={addVariable}
								disabled={
									!newVariable.trim() ||
									variables.includes(newVariable.trim())
								}
								size="sm"
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>

						{/* Variables List */}
						{variables.length > 0 && (
							<div className="space-y-2">
								<p className="text-sm font-medium">
									Current Variables:
								</p>
								<div className="flex flex-wrap gap-2">
									{variables.map((variable) => (
										<div
											key={variable}
											className="bg-muted flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
										>
											<span className="font-mono">{`{{${variable}}}`}</span>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() =>
													removeVariable(variable)
												}
												className="h-4 w-4 p-0 hover:bg-red-100 hover:text-red-600"
											>
												<X className="h-3 w-3" />
											</Button>
										</div>
									))}
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Prompt Text Area */}
				<div className="space-y-2">
					<Label
						htmlFor="prompt"
						className="flex items-center gap-2 text-sm font-medium"
					>
						<Sparkles className="h-4 w-4" />
						Prompt Content
					</Label>
					<HighlightedTextarea
						id="prompt"
						name="prompt"
						placeholder="Enter your prompt here. Use {{variable_name}} to insert variables."
						value={promptText}
						onChange={setPromptText}
						variables={variables}
					/>
					<p className="text-muted-foreground text-xs">
						Write your prompt and use variables like{" "}
						{`{{customer_name}}`} to make it dynamic
					</p>
				</div>

				{/* Preview Card */}
				{promptName && (
					<Card className="border">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Sparkles className="h-4 w-4" />
								Preview
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<p className="font-medium">{promptName}</p>
								<p className="text-muted-foreground text-sm">
									ID:{" "}
									<span className="font-mono">
										{promptId}
									</span>
								</p>
								<p className="text-muted-foreground text-sm">
									Variables:{" "}
									{variables.length > 0
										? variables.join(", ")
										: "None"}
								</p>
								{promptText && (
									<div className="bg-background rounded border p-3 text-sm">
										{promptText.length > 150
											? `${promptText.substring(0, 150)}...`
											: promptText}
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
