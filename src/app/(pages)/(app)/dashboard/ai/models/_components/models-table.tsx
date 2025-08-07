"use client";

import { Model } from "@prisma/client";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { PROVIDERS } from "@/data/models";
import { useRouter } from "next/navigation";

interface ModelsTableProps {
	models: Model[];
}

export default function ModelsTable({ models }: ModelsTableProps) {
	const router = useRouter();

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	if (models.length === 0) {
		return (
			<div className="rounded-lg border border-dashed p-8 text-center">
				<p className="text-muted-foreground">No models found</p>
				<p className="text-muted-foreground mt-1 text-sm">
					Try adjusting your search or create a new model.
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Model ID</TableHead>
						<TableHead>Provider</TableHead>
						<TableHead>Provider Model</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Updated</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{models.map((model) => {
						const provider = PROVIDERS.find(
							(p) => p.id === model.provider.toLowerCase()
						);

						return (
							<TableRow
								key={model.id}
								className="hover:bg-accent/50 cursor-pointer"
								onClick={() =>
									router.push(
										`/dashboard/ai/model/${model.id}`
									)
								}
							>
								<TableCell>
									<div className="flex items-center gap-3">
										{provider && (
											<div className="bg-background flex h-6 w-6 items-center justify-center rounded border">
												<Image
													src={provider.icon}
													alt={provider.name}
													width={12}
													height={12}
													className="h-3 w-3"
												/>
											</div>
										)}
										<span className="font-medium">
											{model.name}
										</span>
									</div>
								</TableCell>
								<TableCell className="font-mono text-sm">
									{model.modelId}
								</TableCell>
								<TableCell>
									<Badge
										variant="secondary"
										className="text-xs"
									>
										{provider?.name || model.provider}
									</Badge>
								</TableCell>
								<TableCell className="font-mono text-sm">
									{model.providerModelId}
								</TableCell>
								<TableCell className="text-muted-foreground text-sm">
									{formatDate(model.createdAt)}
								</TableCell>
								<TableCell className="text-muted-foreground text-sm">
									{formatDate(model.updatedAt)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
