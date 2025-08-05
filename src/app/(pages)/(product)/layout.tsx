import Header from "@/components/header/header";
import { useAuthState } from "@/hooks/use-auth-state";

export default async function ProductLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const authState = await useAuthState();

	return (
		<div>
			<Header authState={authState} />
			{children}
		</div>
	);
}
