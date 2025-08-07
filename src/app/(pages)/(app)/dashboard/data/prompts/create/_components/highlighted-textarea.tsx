"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface HighlightedTextareaProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
	variables: string[];
	name?: string;
	id?: string;
}

export default function HighlightedTextarea({
	value,
	onChange,
	placeholder,
	className,
	variables,
	name,
	id,
}: HighlightedTextareaProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const highlightRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// Function to create highlighted HTML
	const createHighlightedHTML = (text: string) => {
		if (!text) return "";

		// Create a regex pattern that matches all variables
		const variablePattern =
			variables.length > 0 ? `\\{\\{(${variables.join("|")})\\}\\}` : "";

		if (!variablePattern) {
			return text.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;");
		}

		const regex = new RegExp(variablePattern, "gi");

		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(
				regex,
				'<span class="bg-primary text-primary-foreground px-1 rounded">$&</span>'
			)
			.replace(/\n/g, "<br>")
			.replace(/ /g, "&nbsp;");
	};

	// Sync scroll positions
	const handleScroll = () => {
		if (textareaRef.current && highlightRef.current) {
			highlightRef.current.scrollTop = textareaRef.current.scrollTop;
			highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
		}
	};

	// Handle textarea changes
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChange(e.target.value);
	};

	// Update highlight layer when value or variables change
	useEffect(() => {
		if (highlightRef.current) {
			highlightRef.current.innerHTML = createHighlightedHTML(value);
		}
	}, [value, variables]);

	// Sync scroll on mount
	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.addEventListener("scroll", handleScroll);
			return () => textarea.removeEventListener("scroll", handleScroll);
		}
	}, []);

	return (
		<div ref={containerRef} className="relative">
			{/* Highlight layer */}
			<div
				ref={highlightRef}
				className={cn(
					"bg-card pointer-events-none absolute inset-0 min-h-[200px] w-full resize-y overflow-hidden rounded-md border border-transparent px-3 py-2 text-sm break-words whitespace-pre-wrap text-transparent",
					className
				)}
				style={{
					fontFamily: "inherit",
					fontSize: "inherit",
					lineHeight: "inherit",
					letterSpacing: "inherit",
					wordSpacing: "inherit",
				}}
				dangerouslySetInnerHTML={{
					__html: createHighlightedHTML(value),
				}}
			/>

			{/* Actual textarea */}
			<textarea
				ref={textareaRef}
				id={id}
				name={name}
				placeholder={placeholder}
				className={cn(
					"border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring bg-card relative min-h-[200px] w-full resize-y rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
					className
				)}
				value={value}
				onChange={handleChange}
				onScroll={handleScroll}
				style={{
					color: "inherit",
				}}
			/>
		</div>
	);
}
