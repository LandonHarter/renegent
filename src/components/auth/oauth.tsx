"use client";

import { authClient } from "@/auth/client";
import { Button } from "../ui/button";

export default function OAuth() {
	return (
		<>
			<Button
				variant="outline"
				className="w-full"
				onClick={async () => {
					await authClient.signIn.social({
						provider: "google",
					});
				}}
			>
				<img
					src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/google-icon.svg"
					className="mr-2 size-4"
					alt="Google"
				/>
				Sign in with Google
			</Button>
			<Button
				variant="outline"
				className="w-full"
				onClick={async () => {
					await authClient.signIn.social({
						provider: "github",
					});
				}}
			>
				<img
					src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/github-icon.svg"
					className="mr-2 size-4"
					alt="Github"
				/>
				Sign in with Github
			</Button>
		</>
	);
}
