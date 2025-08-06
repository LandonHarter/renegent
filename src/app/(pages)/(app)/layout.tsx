import { useAuthState } from "@/hooks/use-auth-state";
import { redirect } from "next/navigation";

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { signedIn } = await useAuthState();
	if (!signedIn) redirect("/login");

	return children;
}
