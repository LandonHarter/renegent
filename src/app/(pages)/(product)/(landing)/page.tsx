import { useAuthState } from "@/hooks/use-auth-state";
import LandingBackground from "./_components/background";
import Hero from "./_components/hero";

export default async function LandingPage() {
	const { signedIn } = await useAuthState();

	return (
		<main className="relative flex min-h-screen w-screen flex-col items-center pt-24">
			<LandingBackground />
			<Hero signedIn={signedIn} />
		</main>
	);
}
