import { auth } from "@/auth/server";
import { Button } from "@/components/ui/button";
import { createTrpcServer } from "@/trpc/server";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function VerifyRetryPage({
	searchParams,
}: {
	searchParams: Promise<{ email: string }>;
}) {
	const { email } = await searchParams;

	const trpcServer = await createTrpcServer();
	const { verified, exists } = await trpcServer.auth.isVerifiedEmail(email);
	if (!exists || verified) {
		return redirect("/");
	}

	let result;
	try {
		await auth.api.sendVerificationEmail({
			body: {
				email,
			},
		});
	} catch (error) {
		result = false;
	}

	return (
		<div className="flex min-h-screen w-screen flex-col items-center justify-center gap-4">
			{result ? (
				<CheckCircle className="mb-2 size-20 text-green-600" />
			) : (
				<XCircle className="mb-2 size-20 text-red-600" />
			)}
			<h1 className="text-3xl font-bold">
				{result ? "Email sent successfully" : "Uh oh!"}
			</h1>
			<p className="text-muted-foreground text-base">
				{result
					? "You can now login to your account."
					: "Invalid email. Please try again."}
			</p>
			<div className="grid w-full max-w-2xs grid-cols-2 items-center gap-2">
				<Link href="/" className="w-full max-lg:col-span-2">
					<Button variant="outline" className="w-full">
						Go Home
					</Button>
				</Link>
				<Link
					href={result ? "/login" : "/verify"}
					className="w-full max-lg:col-span-2"
				>
					<Button className="group w-full">
						{result ? "Login" : "Resend"}
						<ArrowRight className="size-4 transition-transform duration-200 group-hover:-rotate-45" />
					</Button>
				</Link>
			</div>
		</div>
	);
}
