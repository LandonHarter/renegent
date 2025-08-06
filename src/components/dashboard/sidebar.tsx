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
import { ChevronRight, Code, Key, Settings, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
		title: "Other",
		items: [
			{
				title: "Settings",
				icon: Settings,
				items: [
					{
						title: "General",
						url: "/dashboard/settings/general",
						icon: Wrench,
					},
				],
			},
			{
				title: "Developers",
				icon: Code,
				items: [
					{
						title: "API Keys",
						url: "/dashboard/developers/api-keys",
						icon: Key,
					},
				],
			},
		],
	},
] as SidebarGroup[];

export default function DashboardSidebar() {
	const pathname = usePathname();
	const [openSections, setOpenSections] = useState<Record<string, boolean>>(
		{}
	);

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
			<SidebarContent>
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
