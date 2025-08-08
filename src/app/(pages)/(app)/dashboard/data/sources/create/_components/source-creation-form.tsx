"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Database, FileText, Pencil } from "lucide-react";
import { trpcClient } from "@/trpc/client";
import { toast } from "sonner";
import Form, { SubmitButton } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface SourceCreationFormProps {
	className?: string;
}

export default function SourceCreationForm({
	className = "",
}: SourceCreationFormProps) {
	const router = useRouter();
	const [sourceName, setSourceName] = useState("");
	const [sourceContent, setSourceContent] = useState("");
	const [sourceDescription, setSourceDescription] = useState("");
	// Handle form submission
	const handleFormSubmit = async (formData: FormData) => {
		const name = formData.get("name") as string;
		const description = formData.get("description") as string;
		const content = formData.get("content") as string;

		if (!name || !content || !description) {
			toast.error("Please fill in all required fields");
			return;
		}

		try {
			const source = await trpcClient.data.create.mutate({
				name,
				description,
				content,
			});

			toast.success("Data source created successfully!", {
				description: `${name} has been processed and added to your knowledge base.`,
			});

			router.push(`/dashboard/data/sources`);
		} catch (error: any) {
			toast.error("Failed to create data source", {
				description: error?.message || "An unexpected error occurred",
			});
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
						{/* Source Name */}
						<div className="space-y-2">
							<Label
								htmlFor="name"
								className="flex items-center gap-2 text-sm font-medium"
							>
								<Database className="h-4 w-4" />
								Source Name
							</Label>
							<Input
								id="name"
								name="name"
								placeholder="e.g., Company Documentation, API Reference"
								className="h-11"
								value={sourceName}
								onChange={(e) => setSourceName(e.target.value)}
							/>
							<p className="text-muted-foreground text-xs">
								A descriptive name to identify your data source
							</p>
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="name"
								className="flex items-center gap-2 text-sm font-medium"
							>
								<Pencil className="h-4 w-4" />
								Source Description
							</Label>
							<Input
								id="description"
								name="description"
								placeholder="e.g., Company Documentation, API Reference"
								className="h-11"
								value={sourceDescription}
								onChange={(e) =>
									setSourceDescription(e.target.value)
								}
							/>
							<p className="text-muted-foreground text-xs">
								Describe your data source so the AI knows when
								to fetch from it and how to use it (this is
								actually important).
							</p>
						</div>

						{/* Source Content */}
						<div className="space-y-2">
							<Label
								htmlFor="content"
								className="flex items-center gap-2 text-sm font-medium"
							>
								<FileText className="h-4 w-4" />
								Content
							</Label>
							<Textarea
								id="content"
								name="content"
								placeholder="Paste your document content here. This will be processed and chunked for semantic search."
								value={sourceContent}
								onChange={(e) =>
									setSourceContent(e.target.value)
								}
								className="min-h-64 resize-none"
							/>
							<p className="text-muted-foreground text-xs">
								The content will be automatically chunked and
								embedded for efficient search
							</p>
						</div>

						{/* Processing Info */}
						<Card className="border-blue-200 bg-blue-50">
							<CardContent>
								<div className="flex flex-col items-start gap-3">
									<div className="flex items-center gap-2">
										<Database className="mt-0.5 size-4 text-blue-600" />
										<p className="text-sm font-medium text-blue-900">
											How it works
										</p>
									</div>
									<p className="text-sm text-blue-700">
										Your content will be automatically
										chunked into smaller segments and
										converted into vector embeddings for
										semantic search. This allows AI models
										to efficiently find relevant
										information.
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Submit Button */}
						<div className="flex justify-start">
							<SubmitButton
								loading={loading}
								setLoading={setLoading}
								formRef={formRef}
								disabled={!sourceName || !sourceContent}
							>
								{loading
									? "Processing..."
									: "Create Data Source"}
							</SubmitButton>
						</div>
					</>
				)}
			</Form>
		</div>
	);
}
