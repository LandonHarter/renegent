"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, FileText, Variable, Sparkles } from "lucide-react";
import { trpcClient } from "@/trpc/client";
import { toast } from "sonner";
import Form, { SubmitButton } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import HighlightedTextarea from "./highlighted-textarea";

interface PromptCreationFormProps {
	className?: string;
}

export default function PromptCreationForm({
	className = "",
}: PromptCreationFormProps) {
	const router = useRouter();
	const [promptName, setPromptName] = useState("");
	const [promptId, setPromptId] = useState("");
	const [promptIdError, setPromptIdError] = useState("");
	const [promptText, setPromptText] = useState("");
	const [variables, setVariables] = useState<string[]>([]);
	const [newVariable, setNewVariable] = useState("");

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

	// Handle form submission
	const handleFormSubmit = async (formData: FormData) => {
		const name = formData.get("name") as string;
		const promptId = formData.get("promptId") as string;
		const prompt = formData.get("prompt") as string;

		if (!name || !promptId || !prompt) {
			toast.error("Please fill in all required fields");
			return;
		}

		// Final validation check
		if (!validatePromptId(promptId)) {
			toast.error("Please fix the prompt ID error before submitting");
			return;
		}

		try {
			await trpcClient.prompts.create.mutate({
				name,
				promptId,
				prompt,
				variables,
			});

			toast.success("Prompt created successfully!", {
				description: `${name} is now available for use.`,
			});

			router.push(`/dashboard/data/prompt/${promptId}`);
		} catch (error: any) {
			toast.error("Failed to create prompt", {
				description: error?.message || "An unexpected error occurred",
			});
		}
	};

	// Handle keyboard events for adding variables
	const handleVariableKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addVariable();
		}
	};

	return (
		<div className={cn("w-full", className)}>
			<Form
				action={handleFormSubmit}
				submitOnEnter={false}
				className="flex w-full flex-col gap-6"
			>
				{(formRef, loading, setLoading) => (
					<>
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
								Unique identifier for API usage (lowercase,
								alphanumeric and dashes only)
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
									Define variables that can be used in your
									prompt with {`{{variable_name}}`} syntax
								</p>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Add Variable Input */}
								<div className="flex gap-2">
									<Input
										placeholder="Enter variable name"
										value={newVariable}
										onChange={(e) =>
											setNewVariable(e.target.value)
										}
										onKeyDown={handleVariableKeyDown}
										className="flex-1"
									/>
									<Button
										type="button"
										onClick={addVariable}
										disabled={
											!newVariable.trim() ||
											variables.includes(
												newVariable.trim()
											)
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
															removeVariable(
																variable
															)
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
										<p className="font-medium">
											{promptName}
										</p>
										<p className="text-muted-foreground text-sm">
											ID:{" "}
											<span className="font-mono">
												{promptId ||
													"Set a prompt ID..."}
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

						{/* Submit Button */}
						<div className="flex justify-start">
							<SubmitButton
								loading={loading}
								setLoading={setLoading}
								formRef={formRef}
								disabled={
									!promptName ||
									!promptId ||
									!promptText ||
									!!promptIdError
								}
							>
								Create Prompt
							</SubmitButton>
						</div>
					</>
				)}
			</Form>
		</div>
	);
}
