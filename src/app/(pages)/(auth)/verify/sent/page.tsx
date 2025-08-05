import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function VerifySentPage({
	searchParams,
}: {
	searchParams: Promise<{ email: string }>;
}) {
	const { email } = await searchParams;

	return (
		<div className="flex min-h-screen w-screen flex-col items-center justify-center gap-4">
			<CheckCircle className="mb-2 size-20 text-green-600" />
			<h1 className="text-3xl font-bold">Email sent successfully</h1>
			<p className="text-muted-foreground text-base">
				Please check your email for a verification link.
			</p>
			<div className="grid w-full max-w-2xs grid-cols-2 items-center gap-2">
				<Link href="/" className="w-full max-lg:col-span-2">
					<Button variant="outline" className="w-full">
						Go Home
					</Button>
				</Link>
				<Link
					href={`/verify/retry?email=${email}`}
					className="w-full max-lg:col-span-2"
				>
					<Button className="group w-full">
						Resend Email
						<ArrowRight className="size-4 transition-transform duration-200 group-hover:-rotate-45" />
					</Button>
				</Link>
			</div>
		</div>
	);
}
