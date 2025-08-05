"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import OAuth from "./oauth";
import Form, { SubmitButton } from "../ui/form";
import { toast } from "sonner";
import { authClient } from "@/auth/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const router = useRouter();

	return (
		<div className="flex w-full flex-col items-center gap-4">
			<Card className="w-full max-w-[380px]">
				<CardHeader className="items-center justify-center">
					<Link
						href="/"
						className="flex items-center justify-center gap-2"
					>
						<img
							src="/brand/logo.png"
							className="h-fit w-2/3 max-w-[300px]"
							alt="Shadcn UI Navbar"
						/>
					</Link>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4">
						<OAuth />
						<div className="flex items-center gap-4">
							<span className="bg-input h-px w-full"></span>
							<span className="text-muted-foreground text-xs">
								OR
							</span>
							<span className="bg-input h-px w-full"></span>
						</div>
						<Form
							action={async (data: FormData) => {
								if (!email || !password || !name) {
									toast.error("Please fill in all fields");
									return;
								}

								const { error } = await authClient.signUp.email(
									{
										email,
										password,
										name,
									}
								);

								if (error) {
									toast.error(error.message);
									return;
								}
								router.push("/");
							}}
							className="grid gap-4"
						>
							{(ref, loading, setLoading) => (
								<>
									<div className="grid gap-2">
										<Label htmlFor="name">Name</Label>
										<Input
											id="name"
											type="name"
											placeholder="John Doe"
											name="name"
											value={name}
											onChange={(e) =>
												setName(e.target.value)
											}
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											placeholder="m@example.com"
											name="email"
											value={email}
											onChange={(e) =>
												setEmail(e.target.value)
											}
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="password">
											Password
										</Label>
										<Input
											id="password"
											type="password"
											placeholder="Enter your password"
											name="password"
											value={password}
											onChange={(e) =>
												setPassword(e.target.value)
											}
										/>
									</div>
									<SubmitButton
										className="w-full"
										loading={loading}
										setLoading={setLoading}
										formRef={ref}
									>
										Register
									</SubmitButton>
								</>
							)}
						</Form>
					</div>
				</CardContent>
			</Card>
			<div className="mx-auto flex gap-1 text-sm">
				<p>Already have an account?</p>
				<Link href="/login" className="underline">
					Login
				</Link>
			</div>
		</div>
	);
}
