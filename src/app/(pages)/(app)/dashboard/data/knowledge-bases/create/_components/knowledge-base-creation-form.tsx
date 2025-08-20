"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, BookOpen, Check, Pencil } from "lucide-react";
import { trpcClient } from "@/trpc/client";
import { toast } from "sonner";
import Form, { SubmitButton } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSource } from "@prisma/client";

interface KnowledgeBaseCreationFormProps {
	className?: string;
	dataSources: DataSource[];
}

export default function KnowledgeBaseCreationForm({
	className = "",
	dataSources,
}: KnowledgeBaseCreationFormProps) {
	const router = useRouter();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [selectedDataSources, setSelectedDataSources] = useState<string[]>(
		[]
	);

	const toggleDataSource = (dataSourceId: string) => {
		setSelectedDataSources((prev) =>
			prev.includes(dataSourceId)
				? prev.filter((id) => id !== dataSourceId)
				: [...prev, dataSourceId]
		);
	};

	const handleFormSubmit = async (formData: FormData) => {
		const name = formData.get("name") as string;
		const description = formData.get("description") as string;
		if (!name || !description) {
			toast.error("Please enter a knowledge base name and description");
			return;
		}

		if (selectedDataSources.length === 0) {
			toast.error("Please select at least one data source");
			return;
		}

		try {
			const knowledgeBase = await trpcClient.knowledgeBases.create.mutate(
				{
					name,
					description,
					dataSourceIds: selectedDataSources,
				}
			);

			toast.success("Knowledge base created successfully!", {
				description: `${name} is now available for use.`,
			});

			router.push(`/dashboard/data/knowledge-bases`);
		} catch (error: any) {
			toast.error("Failed to create knowledge base", {
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
						{/* Knowledge Base Name */}
						<div className="space-y-2">
							<Label
								htmlFor="name"
								className="flex items-center gap-2 text-sm font-medium"
							>
								<BookOpen className="h-4 w-4" />
								Knowledge Base Name
							</Label>
							<Input
								id="name"
								name="name"
								placeholder="e.g., Product Documentation"
								className="h-11"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<p className="text-muted-foreground text-xs">
								A descriptive name to identify your knowledge
								base
							</p>
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="description"
								className="flex items-center gap-2 text-sm font-medium"
							>
								<Pencil className="h-4 w-4" />
								Knowledge Base Description
							</Label>
							<Input
								id="description"
								name="description"
								placeholder="e.g., This knowledge base contains product documentation, API references, and other relevant information about Renegent."
								className="h-11"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
							<p className="text-muted-foreground text-xs">
								Describe your data source so the AI knows when
								to fetch from it and how to use it (this is
								actually important).
							</p>
						</div>

						{/* Data Sources Selection */}
						<div className="space-y-2">
							<Label className="flex items-center gap-2 text-sm font-medium">
								<Database className="h-4 w-4" />
								Data Sources
							</Label>

							{dataSources.length === 0 ? (
								<Card className="border-dashed">
									<CardContent className="flex flex-col items-center justify-center py-8">
										<Database className="text-muted-foreground mb-2 h-8 w-8" />
										<p className="text-muted-foreground text-center text-sm">
											No data sources available.
											<br />
											<a
												href="/dashboard/data/sources/create"
												className="text-primary hover:underline"
											>
												Create a data source first
											</a>
										</p>
									</CardContent>
								</Card>
							) : (
								<div className="grid gap-3 md:grid-cols-2">
									{dataSources.map((dataSource) => (
										<button
											key={dataSource.id}
											type="button"
											onClick={() =>
												toggleDataSource(dataSource.id)
											}
											className={cn(
												"hover:bg-muted/50 relative flex cursor-pointer flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors",
												selectedDataSources.includes(
													dataSource.id
												)
													? "bg-card border-primary"
													: "bg-card"
											)}
										>
											{selectedDataSources.includes(
												dataSource.id
											) && (
												<div className="absolute top-2 right-2">
													<Check className="text-primary h-4 w-4" />
												</div>
											)}
											<div className="flex items-center gap-2">
												<Database className="text-muted-foreground h-4 w-4" />
												<span className="text-sm font-medium">
													{dataSource.name}
												</span>
											</div>
											{dataSource.description && (
												<p className="text-muted-foreground line-clamp-2 text-xs">
													{dataSource.description}
												</p>
											)}
										</button>
									))}
								</div>
							)}
							<p className="text-muted-foreground text-xs">
								Select the data sources to include in this
								knowledge base
							</p>
						</div>

						{/* Preview Card */}
						{name && selectedDataSources.length > 0 && (
							<Card className="gap-3">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-base">
										<Check className="h-4 w-4" />
										Preview
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<p className="font-medium">{name}</p>
										<p className="text-muted-foreground text-sm">
											Data Sources:{" "}
											{selectedDataSources.length}{" "}
											selected
										</p>
										<div className="flex flex-wrap gap-1">
											{selectedDataSources.map((id) => {
												const source = dataSources.find(
													(ds) => ds.id === id
												);
												return source ? (
													<span
														key={id}
														className="bg-muted rounded px-2 py-1 text-xs"
													>
														{source.name}
													</span>
												) : null;
											})}
										</div>
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
									!name ||
									selectedDataSources.length === 0 ||
									dataSources.length === 0
								}
							>
								Create Knowledge Base
							</SubmitButton>
						</div>
					</>
				)}
			</Form>
		</div>
	);
}
