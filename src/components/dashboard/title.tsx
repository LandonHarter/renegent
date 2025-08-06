export default function DashboardTitle({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children?: React.ReactNode;
}) {
	return (
		<div className="flex w-full items-center justify-between">
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-bold tracking-tight">{title}</h1>
				{description && (
					<p className="text-muted-foreground text-sm">
						{description}
					</p>
				)}
			</div>
			<div className="flex items-center gap-2">{children}</div>
		</div>
	);
}
