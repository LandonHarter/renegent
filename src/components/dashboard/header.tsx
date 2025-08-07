"use client";

import { usePathname } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbSeparator,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
} from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { Fragment, useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

type Links = {
	href: string;
	items: {
		title: string;
		href?: string;
	}[];
};

export const LINKS: Links[] = [
	{
		href: "/dashboard",
		items: [
			{
				title: "Home",
				href: "/dashboard",
			},
		],
	},
	{
		href: "/dashboard/ai/model/*",
		items: [
			{
				title: "AI",
			},
			{
				title: "Models",
				href: "/dashboard/ai/models",
			},
			{
				title: "Edit Model",
			},
		],
	},
	{
		href: "/dashboard/ai/models",
		items: [
			{
				title: "AI",
			},
			{
				title: "Models",
				href: "/dashboard/ai/models",
			},
		],
	},
	{
		href: "/dashboard/ai/models/create",
		items: [
			{
				title: "AI",
			},
			{
				title: "Models",
				href: "/dashboard/ai/models",
			},
			{
				title: "Create",
				href: "/dashboard/ai/models/create",
			},
		],
	},
	{
		href: "/dashboard/developer/integration/keys",
		items: [
			{
				title: "Developer",
			},
			{
				title: "Integration",
			},
			{
				title: "API Keys",
				href: "/dashboard/developer/integration/keys",
			},
		],
	},
	{
		href: "/dashboard/developer/integration/providers",
		items: [
			{
				title: "Developer",
			},
			{
				title: "Integration",
			},
			{
				title: "Connect Providers",
				href: "/dashboard/developer/integration/providers",
			},
		],
	},
	{
		href: "/dashboard/data/prompts",
		items: [
			{
				title: "Data",
			},
			{
				title: "Prompts",
				href: "/dashboard/data/prompts",
			},
		],
	},
	{
		href: "/dashboard/data/prompts/create",
		items: [
			{
				title: "Data",
			},
			{
				title: "Prompts",
				href: "/dashboard/data/prompts",
			},
			{
				title: "Create",
				href: "/dashboard/data/prompts/create",
			},
		],
	},
	{
		href: "/dashboard/data/prompt/*",
		items: [
			{
				title: "Data",
			},
			{
				title: "Prompts",
				href: "/dashboard/data/prompts",
			},
			{
				title: "Edit Prompt",
			},
		],
	},
];

export default function DashboardHeader() {
	const pathname = usePathname();
	const [breadcrumbLinks, setBreadcrumbLinks] = useState<Links | null>(null);

	useEffect(() => {
		setBreadcrumbLinks(
			LINKS.find((link) =>
				link.href.includes("*")
					? pathname.startsWith(link.href.replace("*", ""))
					: link.href.includes(pathname)
			) || null
		);
	}, [pathname]);

	return (
		<header className="border-border flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbLinks?.items.map((item, i) => (
							<Fragment key={item.title}>
								<BreadcrumbItem className="hidden md:block">
									{item.href &&
									i !== breadcrumbLinks.items.length - 1 ? (
										<BreadcrumbLink href={item.href}>
											{item.title}
										</BreadcrumbLink>
									) : (
										<BreadcrumbPage
											className={
												i !==
												breadcrumbLinks.items.length - 1
													? "text-inherit"
													: "text-foreground"
											}
										>
											{item.title}
										</BreadcrumbPage>
									)}
								</BreadcrumbItem>
								{i !== breadcrumbLinks.items.length - 1 && (
									<>
										<BreadcrumbSeparator className="hidden md:block" />
									</>
								)}
							</Fragment>
						))}
						{!breadcrumbLinks && (
							<>
								<Skeleton className="h-4 w-24" />
								<BreadcrumbSeparator className="hidden md:block" />
								<Skeleton className="h-4 w-24" />
								<BreadcrumbSeparator className="hidden md:block" />
								<Skeleton className="h-4 w-24" />
							</>
						)}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	);
}
