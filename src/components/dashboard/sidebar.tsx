"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
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
import {
	Blocks,
	Book,
	Box,
	Braces,
	Brain,
	ChartBar,
	ChartLine,
	ChevronRight,
	ChevronsUpDown,
	CircleAlert,
	Clipboard,
	Clock,
	CreditCard,
	Database,
	Folder,
	Gamepad2,
	History,
	Home,
	KeyRound,
	Library,
	LogOut,
	Logs,
	Package,
	Pencil,
	Plus,
	Search,
	Settings,
	Sparkles,
	SquareKanban,
	Store,
	Text,
	Unplug,
	Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SlideDown from "../animation/slide-down";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { authClient } from "@/auth/client";
import { User } from "@prisma/client";
import { Skeleton } from "../ui/skeleton";
import { useSidebarOpenSections } from "@/app/(pages)/(app)/dashboard/layout";

type SidebarItem = {
	title: string;
	url: string;
	icon: any;
	target?: string;
};

type SidebarItemGroups = {
	title: string;
	icon: any;
	items?: SidebarItem[];
	url?: string;
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
				title: "Home",
				icon: Home,
				url: "/dashboard",
			},
			{
				title: "Recent Activity",
				icon: Clock,
				url: "/dashboard/activity",
			},
		],
	},
	{
		title: "AI",
		items: [
			{
				title: "Model Management",
				icon: SquareKanban,
				items: [
					{
						title: "My Models",
						icon: Box,
						url: "/dashboard/ai/models",
					},
					{
						title: "Create Model",
						icon: Plus,
						url: "/dashboard/ai/models/create",
					},
				],
			},
			{
				title: "Extensions",
				icon: Blocks,
				items: [
					{
						title: "My Extensions",
						icon: Library,
						url: "/dashboard/ai/library",
					},
					{
						title: "Create Extension",
						icon: Plus,
						url: "/dashboard/ai/extensions/create",
					},
				],
			},
			{
				title: "Marketplace",
				icon: Store,
				items: [
					{
						title: "Model Marketplace",
						icon: Brain,
						url: "/dashboard/ai/marketplace/models",
					},
					{
						title: "Extension Marketplace",
						icon: Blocks,
						url: "/dashboard/ai/marketplace/extensions",
					},
					{
						title: "Data Marketplace",
						icon: Database,
						url: "/dashboard/ai/marketplace/data",
					},
					{
						title: "Prompt Marketplace",
						icon: Pencil,
						url: "/dashboard/ai/marketplace/prompts",
					},
				],
			},
		],
	},
	{
		title: "Content and Data",
		items: [
			{
				title: "Data Management",
				icon: Database,
				items: [
					{
						title: "Knowledge Bases",
						icon: Folder,
						url: "/dashboard/data/knowledge-bases",
					},
					{
						title: "Data Sources",
						icon: Text,
						url: "/dashboard/data/sources",
					},
				],
			},
			{
				title: "Prompts",
				icon: Book,
				items: [
					{
						title: "My Prompts",
						icon: Pencil,
						url: "/dashboard/data/prompts",
					},
					{
						title: "Create Prompt",
						icon: Plus,
						url: "/dashboard/data/prompts/create",
					},
				],
			},
		],
	},
	{
		title: "Developer",
		items: [
			{
				title: "Integration",
				icon: Braces,
				items: [
					{
						title: "API Keys",
						icon: KeyRound,
						url: "/dashboard/developer/integration/keys",
					},
					{
						title: "Documentation",
						icon: Book,
						url: "https://docs.renegent.dev",
						target: "_blank",
					},
					{
						title: "SDKs",
						icon: Package,
						url: "/dashboard/developer/integration/sdks",
					},
					{
						title: "Connect Providers",
						icon: Unplug,
						url: "/dashboard/developer/integration/providers",
					},
				],
			},
			{
				title: "Development Tools",
				icon: Wrench,
				items: [
					{
						title: "Playground",
						icon: Gamepad2,
						url: "/dashboard/developer/tools/playground",
					},
					{
						title: "Request Inspector",
						icon: Search,
						url: "/dashboard/developer/tools/inspector",
					},
				],
			},
			{
				title: "Logs and Monitoring",
				icon: Clipboard,
				items: [
					{
						title: "Logs",
						icon: Logs,
						url: "/dashboard/developer/logs",
					},
					{
						title: "Performance",
						icon: ChartLine,
						url: "/dashboard/developer/performance",
					},
					{
						title: "Error Tracking",
						icon: CircleAlert,
						url: "/dashboard/developer/errors",
					},
					{
						title: "Usage",
						icon: ChartBar,
						url: "/dashboard/developer/usage",
					},
				],
			},
		],
	},
	{
		title: "Account and Billing",
		items: [
			{
				title: "Settings",
				icon: Settings,
				url: "/dashboard/account/settings",
			},
			{
				title: "Billing",
				icon: CreditCard,
				items: [
					{
						title: "Subscription",
						icon: Sparkles,
						url: "/dashboard/account/billing/subscription",
					},
					{
						title: "Billing History",
						icon: History,
						url: "/dashboard/account/billing/history",
					},
					{
						title: "Cost Analytics",
						icon: ChartBar,
						url: "/dashboard/account/billing/analytics",
					},
				],
			},
		],
	},
] as SidebarGroup[];

export default function DashboardSidebar() {
	const { data: session, isPending } = authClient.useSession();
	const user = session?.user as User;

	const { openSections, setOpenSections } = useSidebarOpenSections();

	const pathname = usePathname();

	const router = useRouter();

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
				<Link href="/dashboard" passHref>
					<Image
						src="/brand/logo-transparent.png"
						alt="Renegent Logo"
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
									{item.items ? (
										<>
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
												isOpen={
													openSections[item.title]
												}
											>
												<SidebarMenuSub className="overflow-hidden">
													{item.items.map(
														(subItem, j) => (
															<SidebarMenuSubItem
																key={j + i + 1}
																className="cursor-pointer"
															>
																<Link
																	href={
																		subItem.url!
																	}
																	target={
																		subItem.target
																	}
																	passHref
																>
																	<SidebarMenuSubButton
																		isActive={isActive(
																			subItem.url
																		)}
																		className="hover:bg-accent/50 whitespace-nowrap transition-all duration-200"
																		asChild
																	>
																		<div>
																			<subItem.icon
																				className={`size-4 ${
																					!isActive(
																						subItem.url
																					) &&
																					"stroke-foreground"
																				}`}
																			/>
																			{
																				subItem.title
																			}
																		</div>
																	</SidebarMenuSubButton>
																</Link>
															</SidebarMenuSubItem>
														)
													)}
												</SidebarMenuSub>
											</SlideDown>
										</>
									) : (
										<Link href={item.url!} passHref>
											<SidebarMenuButton className="hover:bg-accent/50 flex w-full cursor-pointer items-center justify-between transition-all duration-200">
												<div className="flex items-center gap-2">
													<item.icon className="size-4" />
													<span className="text-sm">
														{item.title}
													</span>
												</div>
											</SidebarMenuButton>
										</Link>
									)}
								</SidebarMenuItem>
							</SidebarMenu>
						))}
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						{isPending ? (
							<div className="grid h-10 w-full grid-cols-[32px_auto] items-center gap-2 px-2">
								<Skeleton className="h-8 w-8 rounded-lg" />
								<div className="grid h-full grid-rows-2 gap-1">
									<Skeleton className="h-full w-full" />
									<Skeleton className="h-full w-full" />
								</div>
							</div>
						) : (
							<DropdownMenu>
								<DropdownMenuTrigger
									asChild
									className="cursor-pointer transition-all duration-150"
								>
									<SidebarMenuButton
										size="lg"
										className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
									>
										<Avatar className="h-8 w-8 rounded-lg">
											<AvatarImage
												src={user.image!}
												alt={user.name}
											/>
											<AvatarFallback className="rounded-lg">
												{user.name?.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-medium">
												{user.name}
											</span>
											<span className="truncate text-xs">
												{user.email}
											</span>
										</div>
										<ChevronsUpDown className="ml-auto size-4" />
									</SidebarMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
									align="end"
									sideOffset={4}
								>
									<DropdownMenuLabel className="p-0 font-normal">
										<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
											<Avatar className="h-8 w-8 rounded-lg">
												<AvatarImage
													src={user.image!}
													alt={user.name}
												/>
												<AvatarFallback className="rounded-lg">
													{user.name?.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<div className="grid flex-1 text-left text-sm leading-tight">
												<span className="truncate font-medium">
													{user.name}
												</span>
												<span className="truncate text-xs">
													{user.email}
												</span>
											</div>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem>
											<Sparkles />
											Upgrade to Pro
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem
											variant="destructive"
											onClick={async () => {
												await authClient.signOut();
												router.push("/");
											}}
										>
											<LogOut />
											Log Out
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
