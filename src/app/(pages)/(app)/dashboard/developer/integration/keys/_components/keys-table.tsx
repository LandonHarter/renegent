"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import KeyDetails from "./key-details";
import { ApiKey } from "@prisma/client";

export default function KeysTable({ keys }: { keys: ApiKey[] }) {
	const [copiedKey, setCopiedKey] = useState<string | null>(null);

	const copyToClipboard = async (key: string) => {
		try {
			await navigator.clipboard.writeText(key);
			setCopiedKey(key);

			// Reset the copied state after 2 seconds
			setTimeout(() => {
				setCopiedKey(null);
			}, 2000);
		} catch (err) {
			console.error("Failed to copy: ", err);
		}
	};

	return (
		<div className="rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Key</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Created</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{keys.map((key, index) => (
						<TableRow key={key.id || index}>
							<TableCell>
								{key.name || `API Key ${index + 1}`}
							</TableCell>
							<TableCell className="font-mono text-sm">
								<button
									onClick={() => copyToClipboard(key.key)}
									className="group relative cursor-pointer rounded px-2 py-1 transition-colors hover:bg-gray-100"
									title="Click to copy"
								>
									<span className="text-gray-700">
										{key.key || "N/A"}
									</span>
									{/* Copied confirmation tooltip */}
									<span
										className={`absolute -top-8 left-1/2 z-10 -translate-x-1/2 transform rounded bg-green-600 px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg transition-all duration-300 ease-in-out ${
											copiedKey === key.key
												? "translate-y-0 scale-100 opacity-100"
												: "translate-y-1 scale-95 opacity-0"
										}`}
									>
										Copied!
									</span>
									{/* Hover tooltip */}
									<span
										className={`absolute -top-8 left-1/2 z-10 -translate-x-1/2 transform rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg transition-all duration-200 ease-in-out ${
											copiedKey !== key.key
												? "translate-y-1 scale-95 opacity-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
												: "translate-y-1 scale-95 opacity-0"
										}`}
									>
										Click to copy
									</span>
								</button>
							</TableCell>
							<TableCell>
								<span
									className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
										key.enabled
											? "bg-green-100 text-green-800"
											: "bg-muted-foreground/15 text-gray-800"
									}`}
								>
									{key.enabled ? "Enabled" : "Disabled"}
								</span>
							</TableCell>
							<TableCell>
								{key.createdAt
									? new Date(
											key.createdAt
										).toLocaleDateString()
									: "N/A"}
							</TableCell>
							<TableCell className="text-right">
								<KeyDetails apiKey={key}>
									<Button variant="outline" size="sm">
										View Details
									</Button>
								</KeyDetails>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
