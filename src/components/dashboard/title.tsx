import Image from "next/image";

export default function DashboardTitle({
	title,
	description,
	image,
	children,
}: {
	title: string;
	description?: React.ReactNode;
	image?: string;
	children?: React.ReactNode;
}) {
	return (
		<div className="flex w-full items-center justify-between">
			<div className="flex items-center gap-4">
				{image && (
					<Image
						src={image}
						alt={title}
						width={64}
						height={64}
						className={`rounded-md ${description ? "size-10" : "size-7"}`}
					/>
				)}
				<div className="flex flex-col gap-1">
					<h1 className="text-2xl font-bold tracking-tight">
						{title}
					</h1>
					{description && (
						<div className="text-muted-foreground text-sm">
							{description}
						</div>
					)}
				</div>
			</div>
			<div className="flex items-center gap-2">{children}</div>
		</div>
	);
}
