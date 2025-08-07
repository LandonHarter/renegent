"use client";

import DashboardHeader from "@/components/dashboard/header";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Image from "next/image";
import { createContext, useContext, useState } from "react";

const SidebarOpenSectionsContext = createContext<{
	openSections: Record<string, boolean>;
	setOpenSections: React.Dispatch<
		React.SetStateAction<Record<string, boolean>>
	>;
}>({
	openSections: {},
	setOpenSections: () => {},
});

export function useSidebarOpenSections() {
	return useContext(SidebarOpenSectionsContext);
}

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [openSections, setOpenSections] = useState<Record<string, boolean>>(
		{}
	);

	return (
		<div className="relative">
			<SidebarProvider className="absolute max-lg:hidden">
				<SidebarOpenSectionsContext.Provider
					value={{ openSections, setOpenSections }}
				>
					<DashboardSidebar />
				</SidebarOpenSectionsContext.Provider>
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
