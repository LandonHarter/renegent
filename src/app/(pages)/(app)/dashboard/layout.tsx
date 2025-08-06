import DashboardHeader from "@/components/dashboard/header";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthState } from "@/hooks/use-auth-state";
import Image from "next/image";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user } = await useAuthState();

	return (
		<div className="relative">
			<SidebarProvider className="absolute max-lg:hidden">
				<DashboardSidebar user={user!} />
				<div className="flex w-full flex-col overflow-x-hidden">
					<DashboardHeader />
					<main className="w-full px-4 py-2 pt-3">{children}</main>
				</div>
			</SidebarProvider>
			<div className="absolute flex h-screen w-screen flex-col items-center justify-center gap-2 px-8 lg:hidden">
				<Image
					src="/brand/logo-transparent.png"
					alt="Renegent Logo"
					width={256}
					height={256}
					className="h-24 w-fit"
				/>
				<p className="text-foreground/50 text-center text-xl">
					Please use a larger screen to view this page.
				</p>
			</div>
		</div>
	);
}
