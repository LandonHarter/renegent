"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Form, { SubmitButton } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpcClient } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateKey({ children }: { children: React.ReactNode }) {
	const [name, setName] = useState("");
	const [open, setOpen] = useState(false);
	const router = useRouter();

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create API Key</DialogTitle>
					<DialogDescription>
						Create a new API key to use in your applications
					</DialogDescription>
				</DialogHeader>
				<Form
					action={async () => {
						await trpcClient.keys.create.mutate(name);
						router.refresh();
						setOpen(false);
					}}
					className="flex flex-col gap-4"
				>
					{(ref, loading, setLoading) => (
						<>
							<Input
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Key name..."
							/>
							<DialogFooter className="flex w-full items-center justify-end gap-2">
								<DialogClose asChild>
									<Button variant="outline">Cancel</Button>
								</DialogClose>
								<SubmitButton
									formRef={ref}
									loading={loading}
									setLoading={setLoading}
								>
									Create Key
								</SubmitButton>
							</DialogFooter>
						</>
					)}
				</Form>
			</DialogContent>
		</Dialog>
	);
}
