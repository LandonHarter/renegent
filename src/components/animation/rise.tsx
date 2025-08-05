"use client";

import { motion } from "framer-motion";

export default function Rise({
	duration,
	delay,
	viewportThreshold,
	className,
	children,
}: {
	duration?: number;
	delay?: number;
	viewportThreshold?: number;
	className?: string;
	children?: React.ReactNode;
}) {
	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{
				once: true,
				amount: viewportThreshold ?? 0.25,
			}}
			variants={{
				hidden: {
					opacity: 0,
					y: 20,
				},
				visible: {
					opacity: 1,
					y: 0,
					transition: {
						duration: duration ?? 0.5,
						delay: delay ?? 0,
					},
				},
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}
