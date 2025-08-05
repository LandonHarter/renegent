"use client";

import { motion, Transition } from "framer-motion";

export default function Fade({
	transition,
	children,
}: {
	transition?: Transition;
	children: React.ReactNode;
}) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={transition}
		>
			{children}
		</motion.div>
	);
}
