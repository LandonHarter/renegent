"use client";

import { motion } from "framer-motion";

export default function SlideDown({
	isOpen,
	children,
	className,
}: {
	isOpen: boolean;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<motion.div
			initial={false}
			animate={{
				height: isOpen ? "auto" : 0,
				opacity: isOpen ? 1 : 0,
			}}
			transition={{
				duration: 0.2,
				ease: "easeInOut",
			}}
			className={`overflow-hidden ${className || ""}`}
		>
			<motion.div
				initial={false}
				animate={{
					y: isOpen ? 0 : -10,
				}}
				transition={{
					duration: 0.2,
					ease: "easeInOut",
				}}
			>
				{children}
			</motion.div>
		</motion.div>
	);
}
