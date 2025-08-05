"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User } from "@prisma/client";
import { authClient } from "@/auth/client";

export default function HeaderAvatar({ user }: { user: User }) {
	const router = useRouter();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="size-9">
					<AvatarImage src={user.image ?? undefined} />
					<AvatarFallback>
						{user.name.includes(" ")
							? user.name.split(" ")[0][0] +
								user.name.split(" ")[1][0]
							: user.name.slice(0, 2)}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuItem
					variant="destructive"
					onClick={async () => {
						await authClient.signOut();
						router.refresh();
					}}
				>
					<LogOut />
					Sign Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
