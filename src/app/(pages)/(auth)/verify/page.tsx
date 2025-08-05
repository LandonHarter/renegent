import { auth } from "@/auth/server";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default async function VerifyPage({
	searchParams,
}: {
	searchParams: Promise<{ token: string; email: string }>;
}) {
	const { token, email } = await searchParams;

	let result;
	try {
		result = await auth.api.verifyEmail({
			query: {
				token,
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
				{result ? "Email verified successfully" : "Uh oh!"}
			</h1>
			<p className="text-muted-foreground text-base">
				{result
					? "You can now login to your account."
					: "Invalid token. This link may have expired."}
			</p>
			<div className="grid w-full max-w-2xs grid-cols-2 items-center gap-2">
				<Link href="/" className="w-full max-lg:col-span-2">
					<Button variant="outline" className="w-full">
						Go Home
					</Button>
				</Link>
				<Link
					href={result ? "/login" : `/verify/retry?email=${email}`}
					className="w-full max-lg:col-span-2"
				>
					<Button className="group w-full">
						{result ? "Login" : "Resend Email"}
						<ArrowRight className="size-4 transition-transform duration-200 group-hover:-rotate-45" />
					</Button>
				</Link>
			</div>
		</div>
	);
}
