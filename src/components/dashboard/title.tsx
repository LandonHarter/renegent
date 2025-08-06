export default function DashboardTitle({
	title,
	children,
}: {
	title: string;
	children?: React.ReactNode;
}) {
	return (
		<div className="flex w-full items-center justify-between">
			<h1 className="text-2xl font-bold tracking-tight">{title}</h1>
			<div className="flex items-center gap-2">{children}</div>
		</div>
	);
}
