"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Form, { SubmitButton } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { ApiKey } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { trpcClient } from "@/trpc/client";

export default function KeyDetails({
	apiKey,
	children,
}: {
	apiKey: ApiKey;
	children: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [keyVisible, setKeyVisible] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showToggleDialog, setShowToggleDialog] = useState(false);
	const [isCopying, setIsCopying] = useState(false);
	const router = useRouter();

	const copyToClipboard = async (text: string) => {
		try {
			setIsCopying(true);
			await navigator.clipboard.writeText(text);
			setTimeout(() => {
				setIsCopying(false);
			}, 2500);
		} catch (err) {
			console.error("Failed to copy to clipboard:", err);
			setIsCopying(false);
		}
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							API Key Details{" "}
							<span
								className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
									apiKey.enabled
										? "bg-green-100 text-green-800"
										: "bg-muted-foreground/15 text-gray-800"
								}`}
							>
								{apiKey.enabled ? "Enabled" : "Disabled"}
							</span>
						</DialogTitle>
						<DialogDescription>
							Complete information about your API key
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-6">
						{/* Key Name */}
						<div className="space-y-2">
							<Label className="text-sm font-medium">
								Key Name
							</Label>
							<div className="bg-muted rounded-md p-3 text-sm">
								{apiKey.name || "Unnamed Key"}
							</div>
						</div>

						{/* API Key */}
						<div className="space-y-2">
							<Label className="text-sm font-medium">
								API Key
							</Label>
							<div className="flex items-center space-x-2">
								<div className="bg-muted flex-1 rounded-md p-3 font-mono text-sm break-all">
									{keyVisible
										? apiKey.key || "N/A"
										: "••••••••••••••••••••••••••••••••"}
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setKeyVisible(!keyVisible)}
								>
									{keyVisible ? "Hide" : "Show"}
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										apiKey.key &&
										copyToClipboard(apiKey.key)
									}
									className={`transition-all duration-300 ${isCopying && "!bg-emerald-500 !text-white"}`}
								>
									<div className="flex items-center gap-2">
										{isCopying ? (
											<>
												<Check className="size-[14px]" />
											</>
										) : (
											<>
												<Copy className="size-[14px]" />
											</>
										)}
									</div>
								</Button>
							</div>
						</div>

						{/* Timestamps */}
						<div className="grid grid-cols-1 gap-4">
							{apiKey.createdAt && (
								<div className="space-y-2">
									<Label className="text-sm font-medium">
										Created
									</Label>
									<div className="bg-muted rounded-md p-3 text-sm">
										{new Date(
											apiKey.createdAt
										).toLocaleString()}
									</div>
								</div>
							)}

							<div className="space-y-2">
								<Label className="text-sm font-medium">
									Last Used
								</Label>
								<div className="bg-muted rounded-md p-3 text-sm">
									{apiKey.lastUsed
										? new Date(
												apiKey.lastUsed
											).toLocaleString()
										: "Never"}
								</div>
							</div>
						</div>

						{/* Delete Section */}
						<div className="border-t pt-6">
							<div className="space-y-4">
								<div>
									<Label className="text-sm font-medium text-red-600">
										Danger Zone
									</Label>
									<p className="mt-1 text-sm text-gray-500">
										Once you delete this API key, it cannot
										be recovered.
									</p>
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										onClick={() =>
											setShowToggleDialog(true)
										}
										disabled={!apiKey.key}
									>
										{apiKey.enabled ? "Disable" : "Enable"}{" "}
										API Key
									</Button>
									<Button
										variant="destructive"
										onClick={() =>
											setShowDeleteDialog(true)
										}
										disabled={!apiKey.key}
									>
										Delete API Key
									</Button>
								</div>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<DialogContent className="sm:max-w-[400px]">
					<DialogHeader>
						<DialogTitle>Delete API Key</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this API key? This
							action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="rounded-md bg-red-50 p-4">
							<p className="text-sm font-medium text-red-800">
								Key: {apiKey.name || "Unnamed Key"}
							</p>
							<p className="mt-1 font-mono text-xs text-red-600">
								{apiKey.key
									? `${apiKey.key.slice(0, 8)}...${apiKey.key.slice(-4)}`
									: "N/A"}
							</p>
						</div>
						<Form
							action={async () => {
								await trpcClient.keys.detele.mutate(apiKey.id);
								router.refresh();
							}}
							className="flex w-full items-center justify-end space-x-2"
						>
							{(formRef, loading, setLoading) => (
								<>
									<DialogClose asChild>
										<Button variant="outline">
											Cancel
										</Button>
									</DialogClose>
									<SubmitButton
										formRef={formRef}
										loading={loading}
										setLoading={setLoading}
										variant="destructive"
									>
										Yes, Delete
									</SubmitButton>
								</>
							)}
						</Form>
					</div>
				</DialogContent>
			</Dialog>

			{/* Toggle Confirmation Dialog */}
			<Dialog open={showToggleDialog} onOpenChange={setShowToggleDialog}>
				<DialogContent className="sm:max-w-[400px]">
					<DialogHeader>
						<DialogTitle>
							{apiKey.enabled ? "Disable" : "Enable"} API Key
						</DialogTitle>
						<DialogDescription>
							Are you sure you want to{" "}
							{apiKey.enabled ? "disable" : "enable"} this API
							key?
							{apiKey.enabled
								? " This will prevent it from being used until re-enabled."
								: " This will allow it to be used for API requests."}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div
							className={`rounded-md p-4 ${apiKey.enabled ? "bg-orange-50" : "bg-green-50"}`}
						>
							<p
								className={`text-sm font-medium ${apiKey.enabled ? "text-orange-800" : "text-green-800"}`}
							>
								Key: {apiKey.name || "Unnamed Key"}
							</p>
							<p
								className={`mt-1 font-mono text-xs ${apiKey.enabled ? "text-orange-600" : "text-green-600"}`}
							>
								{apiKey.key
									? `${apiKey.key.slice(0, 8)}...${apiKey.key.slice(-4)}`
									: "N/A"}
							</p>
							<p
								className={`mt-2 text-xs ${apiKey.enabled ? "text-orange-700" : "text-green-700"}`}
							>
								Status:{" "}
								{apiKey.enabled
									? "Currently Enabled"
									: "Currently Disabled"}
							</p>
						</div>
						<Form
							action={async () => {
								await trpcClient.keys.toggle.mutate(apiKey.id);
								setShowToggleDialog(false);
								router.refresh();
							}}
							className="flex w-full items-center justify-end space-x-2"
						>
							{(formRef, loading, setLoading) => (
								<>
									<DialogClose asChild>
										<Button variant="outline">
											Cancel
										</Button>
									</DialogClose>
									<SubmitButton
										formRef={formRef}
										loading={loading}
										setLoading={setLoading}
									>
										Yes,{" "}
										{apiKey.enabled ? "Disable" : "Enable"}
									</SubmitButton>
								</>
							)}
						</Form>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
