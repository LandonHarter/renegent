"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { usePlayground } from "../_context/playground-context";

interface PlaygroundMessagesProps {
	className?: string;
}

export default function PlaygroundMessages({
	className,
}: PlaygroundMessagesProps) {
	const { messages, disabled } = usePlayground();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	if (messages.length === 0) {
		return (
			<div
				className={cn(
					"bg-background/50 flex flex-1 items-center justify-center",
					className
				)}
			>
				<div className="space-y-2 text-center">
					<p className="text-muted-foreground text-lg">
						No messages yet
					</p>
					<p className="text-muted-foreground/60 text-sm">
						Start a conversation by typing a message below
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"bg-background/50 relative flex-1 space-y-4 overflow-y-auto p-4",
				disabled && "opacity-50",
				className
			)}
		>
			{disabled && (
				<div className="bg-background/20 absolute inset-0 z-10 flex items-center justify-center">
					<div className="space-y-2 text-center">
						<p className="text-muted-foreground text-sm font-medium">
							API Keys Required
						</p>
						<p className="text-muted-foreground/60 text-xs">
							Configure provider API keys to start chatting
						</p>
					</div>
				</div>
			)}
			{messages.map((message) => (
				<div
					key={message.id}
					className={cn(
						"flex",
						message.role === "user"
							? "justify-end"
							: "justify-start"
					)}
				>
					<div
						className={cn(
							"max-w-[70%] space-y-1 rounded-lg px-4 py-2",
							message.role === "user"
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground"
						)}
					>
						<div className="break-words whitespace-pre-wrap">
							{message.isLoading ? (
								<div className="flex items-center space-x-1 py-2">
									<div className="flex space-x-1">
										<div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]"></div>
										<div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]"></div>
										<div className="h-2 w-2 animate-bounce rounded-full bg-current"></div>
									</div>
								</div>
							) : (
								<span
									className={`${message.role === "user" ? "text-white" : "text-foreground"}`}
								>
									{message.content}
								</span>
							)}
						</div>
						<div className="text-xs opacity-70">
							{message.timestamp.toLocaleTimeString()}
						</div>
					</div>
				</div>
			))}
			<div ref={messagesEndRef} />
		</div>
	);
}
