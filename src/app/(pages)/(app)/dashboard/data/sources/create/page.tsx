import DashboardTitle from "@/components/dashboard/title";
import DashboardWrapper from "@/components/dashboard/wrapper";
import SourceCreationForm from "./_components/source-creation-form";

export default function CreateSourcePage() {
	return (
		<DashboardWrapper>
			<DashboardTitle
				title="Create Data Source"
				description="Add a new knowledge base source to your collection"
			/>
			<div className="max-w-2xl">
				<SourceCreationForm />
			</div>
		</DashboardWrapper>
	);
}
