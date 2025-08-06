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
			<SidebarProvider className="absolute max-md:hidden">
				<DashboardSidebar user={user!} />
				<div className="flex w-full flex-col overflow-x-hidden">
					<DashboardHeader />
					<main className="w-full px-6 py-2 pt-4">{children}</main>
				</div>
			</SidebarProvider>
			<div className="absolute flex h-screen w-screen flex-col items-center justify-center gap-2 px-8 md:hidden">
				<Image
					src="/brand/full-transparent.svg"
					alt="Draftl Logo"
					width={256}
					height={256}
					className="aspect-[2563/1024] h-24 w-fit"
				/>
				<p className="text-foreground/50 text-center text-xl">
					Please use a larger screen to view this page.
				</p>
			</div>
		</div>
	);
}
