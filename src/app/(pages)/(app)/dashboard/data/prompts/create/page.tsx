import DashboardTitle from "@/components/dashboard/title";
import DashboardWrapper from "@/components/dashboard/wrapper";
import PromptCreationForm from "./_components/prompt-creation-form";

export default function CreatePromptPage() {
	return (
		<DashboardWrapper>
			<DashboardTitle
				title="Create Prompt"
				description="Create reusable prompt templates with dynamic variables for consistent AI interactions"
			/>

			<PromptCreationForm />
		</DashboardWrapper>
	);
}
