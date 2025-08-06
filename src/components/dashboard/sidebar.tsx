"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight, Home, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import SlideDown from "../animation/slide-down";

type SidebarItem = {
	title: string;
	url: string;
	icon: any;
};

type SidebarItemGroups = {
	title: string;
	icon: any;
	items: SidebarItem[];
};

type SidebarGroup = {
	title: string;
	items: SidebarItemGroups[];
};

const GROUPS = [
	{
		title: "General",
		items: [
			{
				title: "Dashboard",
				icon: LayoutDashboard,
				items: [
					{
						title: "Home",
						url: "/dashboard",
						icon: Home,
					},
				],
			},
		],
	},
] as SidebarGroup[];

const SIDEBAR_STATE_KEY = "sidebar-open-sections";

export default function DashboardSidebar() {
	const pathname = usePathname();
	const [openSections, setOpenSections] = useState<Record<string, boolean>>(
		{}
	);
	const [isHydrated, setIsHydrated] = useState(false);

	// Load saved state from localStorage on mount
	useEffect(() => {
		const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
		if (savedState) {
			try {
				const parsedState = JSON.parse(savedState);
				setOpenSections(parsedState);
			} catch (error) {
				console.warn("Failed to parse saved sidebar state:", error);
			}
		} else {
			// Set intelligent defaults based on current route
			const defaultState: Record<string, boolean> = {};
			GROUPS.forEach((group) => {
				group.items.forEach((item) => {
					// Open section if current page is within this section
					const isCurrentSectionActive = item.items.some((subItem) =>
						pathname.startsWith(subItem.url)
					);
					defaultState[item.title] = isCurrentSectionActive;
				});
			});
			setOpenSections(defaultState);
		}
		setIsHydrated(true);
	}, [pathname]);

	// Save state to localStorage whenever it changes
	useEffect(() => {
		if (isHydrated) {
			localStorage.setItem(
				SIDEBAR_STATE_KEY,
				JSON.stringify(openSections)
			);
		}
	}, [openSections, isHydrated]);

	const isActive = (url: string) => pathname === url;
	const toggleSection = (sectionTitle: string) => {
		setOpenSections((prev) => ({
			...prev,
			[sectionTitle]: !prev[sectionTitle],
		}));
	};

	return (
		<Sidebar>
			<SidebarHeader>
				<Link href="/dashboard">
					<Image
						src="/brand/logo-transparent.png"
						alt="Draftl Logo"
						width={1024}
						height={1024}
						className="h-12 w-fit"
					/>
				</Link>
			</SidebarHeader>
			<SidebarContent className="flex flex-col">
				{GROUPS.map((group) => (
					<SidebarGroup
						key={group.title}
						className="flex list-none flex-col gap-1"
					>
						<SidebarGroupLabel>{group.title}</SidebarGroupLabel>
						{group.items.map((item, i) => (
							<SidebarMenu key={i}>
								<SidebarMenuItem>
									<SidebarMenuButton
										className="hover:bg-accent/50 flex w-full cursor-pointer items-center justify-between transition-all duration-200"
										onClick={() =>
											toggleSection(item.title)
										}
									>
										<div className="flex items-center gap-2">
											<item.icon className="size-4" />
											<span className="text-sm">
												{item.title}
											</span>
										</div>
										<ChevronRight
											className={`ml-auto transition-transform duration-200 ${
												openSections[item.title]
													? "rotate-90"
													: ""
											}`}
										/>
									</SidebarMenuButton>
									<SlideDown
										isOpen={openSections[item.title]}
									>
										<SidebarMenuSub className="overflow-hidden">
											{item.items.map((subItem, j) => (
												<SidebarMenuSubItem
													key={j + i + 1}
													className="cursor-pointer"
												>
													<SidebarMenuSubButton
														isActive={isActive(
															subItem.url
														)}
														className="hover:bg-accent/50 transition-all duration-200"
														href={subItem.url}
													>
														<subItem.icon className="size-4" />
														{subItem.title}
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</SlideDown>
								</SidebarMenuItem>
							</SidebarMenu>
						))}
					</SidebarGroup>
				))}
			</SidebarContent>
		</Sidebar>
	);
}
