"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ApiKeyWarning() {
	return (
		<div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
			<div className="flex items-start gap-3">
				<AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
				<div className="flex-1">
					<h3 className="text-sm font-medium text-yellow-800">
						Provider API Keys Required
					</h3>
					<p className="mt-1 text-sm text-yellow-700">
						You need to configure provider API keys (OpenAI,
						Anthropic, etc.) to use the playground. All features are
						disabled until you add at least one provider API key.
					</p>
					<div className="mt-3">
						<Button
							asChild
							size="sm"
							variant="outline"
							className="bg-white"
						>
							<Link href="/dashboard/developer/integration/keys">
								Configure API Keys
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
