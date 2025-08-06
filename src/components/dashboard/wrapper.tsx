export default function DashboardWrapper({
	children,
}: {
	children?: React.ReactNode;
}) {
	return <div className="flex w-full flex-col gap-4 pb-4">{children}</div>;
}
