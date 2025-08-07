import DashboardTitle from "@/components/dashboard/title";
import DashboardWrapper from "@/components/dashboard/wrapper";
import { getProvider } from "@/data/models";
import { createTrpcServer } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function ModelPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;
	const trpcServer = await createTrpcServer();
	const model = await trpcServer.models.get(id);

	if (!model) {
		redirect("/dashboard/ai/models/create");
	}

	return (
		<DashboardWrapper>
			<DashboardTitle
				title={model.name}
				image={getProvider(model.provider)?.icon}
			/>
		</DashboardWrapper>
	);
}
