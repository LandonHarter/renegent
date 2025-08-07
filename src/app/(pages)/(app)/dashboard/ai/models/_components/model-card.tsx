"use client";

import { Model } from "@prisma/client";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { PROVIDERS } from "@/data/models";
import Link from "next/link";

interface ModelCardProps {
	model: Model;
}

export default function ModelCard({ model }: ModelCardProps) {
	const provider = PROVIDERS.find(
		(p) => p.id === model.provider.toLowerCase()
	);

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<Link href={`/dashboard/ai/model/${model.id}`} passHref>
			<Card className="transition-all duration-200 hover:scale-[1.01] hover:shadow-md">
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							{provider && (
								<div className="bg-background flex h-8 w-8 items-center justify-center rounded-lg border">
									<Image
										src={provider.icon}
										alt={provider.name}
										width={16}
										height={16}
										className="h-4 w-4"
									/>
								</div>
							)}
							<div>
								<CardTitle className="text-base">
									{model.name}
								</CardTitle>
								<CardDescription className="mt-1 text-xs">
									{model.modelId}
								</CardDescription>
							</div>
						</div>
						<Badge variant="secondary" className="text-xs">
							{provider?.name || model.provider}
						</Badge>
					</div>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="text-muted-foreground space-y-2 text-sm">
						<div className="flex justify-between">
							<span>Provider Model:</span>
							<span className="font-mono text-xs">
								{model.providerModelId}
							</span>
						</div>
						<div className="flex justify-between">
							<span>Created:</span>
							<span>{formatDate(model.createdAt)}</span>
						</div>
						<div className="flex justify-between">
							<span>Updated:</span>
							<span>{formatDate(model.updatedAt)}</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
