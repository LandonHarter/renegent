import DashboardTitle from "@/components/dashboard/title";
import DashboardWrapper from "@/components/dashboard/wrapper";
import { Button } from "@/components/ui/button";
import { createTrpcServer } from "@/trpc/server";
import CreateKey from "./_components/create-key";
import KeysTable from "./_components/keys-table";
import { Plus } from "lucide-react";

export default async function ApiKeysPage() {
	const trpcServer = await createTrpcServer();
	const keys = await trpcServer.keys.get();

	return (
		<DashboardWrapper>
			<DashboardTitle
				title="API Keys"
				description="Manage your Renegent API keys"
			>
				<CreateKey>
					<Button>
						<Plus />
						Create Key
					</Button>
				</CreateKey>
			</DashboardTitle>

			{keys && keys.length > 0 ? (
				<KeysTable keys={keys} />
			) : (
				<div className="py-12 text-center">
					<h3 className="text-lg font-medium text-gray-900">
						No API keys yet
					</h3>
					<p className="mt-1 text-gray-500">
						Get started by creating your first API key.
					</p>
					<div className="mt-6">
						<CreateKey>
							<Button>Create your first API Key</Button>
						</CreateKey>
					</div>
				</div>
			)}
		</DashboardWrapper>
	);
}
