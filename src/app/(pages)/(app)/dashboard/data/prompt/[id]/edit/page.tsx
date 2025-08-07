import DashboardTitle from "@/components/dashboard/title";
import DashboardWrapper from "@/components/dashboard/wrapper";
import { createTrpcServer } from "@/trpc/server";
import { redirect } from "next/navigation";
import PromptEditForm from "./_components/prompt-edit-form";

export default async function PromptEditPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: promptId } = await params;
	const trpcServer = await createTrpcServer();
	const prompt = await trpcServer.prompts.get(promptId);

	if (!prompt) {
		redirect("/dashboard/data/prompts");
	}

	return (
		<DashboardWrapper>
			<DashboardTitle title={`Edit ${prompt.name}`} />
			<PromptEditForm prompt={prompt} />
		</DashboardWrapper>
	);
}
