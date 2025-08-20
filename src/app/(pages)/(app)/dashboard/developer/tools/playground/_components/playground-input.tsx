"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlayground } from "../_context/playground-context";

interface PlaygroundInputProps {
	className?: string;
}

export default function PlaygroundInput({ className }: PlaygroundInputProps) {
	const { sendMessage, disabled, isConfigured, isLoading } = usePlayground();
	const [input, setInput] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleSend = () => {
		const trimmedInput = input.trim();
		if (trimmedInput && !disabled && !isLoading) {
			sendMessage(trimmedInput);
			setInput("");
			// Reset textarea height
			if (textareaRef.current) {
				textareaRef.current.style.height = "auto";
			}
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(e.target.value);

		// Auto-resize textarea
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

	// Dynamic placeholder based on context state
	const placeholder = disabled
		? "Configure provider API keys to start chatting..."
		: isLoading
			? "AI is responding..."
			: isConfigured
				? "Type your message..."
				: "Select a model and prompt to start chatting...";

	return (
		<div
			className={cn(
				"bg-background/95 supports-[backdrop-filter]:bg-background/60 border-border sticky bottom-0 border-t p-4 backdrop-blur",
				className
			)}
		>
			<div className="flex items-end gap-2">
				<div className="flex-1 space-y-2">
					<Textarea
						ref={textareaRef}
						value={input}
						onChange={handleInputChange}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						disabled={disabled || isLoading}
						className="max-h-[200px] min-h-[60px] resize-none"
						rows={2}
					/>
					<p className="text-muted-foreground text-xs">
						Press{" "}
						<kbd className="bg-muted border-border rounded border px-1 py-0.5 text-xs">
							Shift
						</kbd>{" "}
						+{" "}
						<kbd className="bg-muted border-border rounded border px-1 py-0.5 text-xs">
							Enter
						</kbd>{" "}
						for new line
					</p>
				</div>
				<Button
					onClick={handleSend}
					disabled={!isConfigured || !input.trim() || isLoading}
					size="icon"
					className="mb-7 flex-shrink-0"
				>
					<Send className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
