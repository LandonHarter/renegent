import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const font = Open_Sans({
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${font.className} overflow-x-hidden antialiased`}>
				<Toaster richColors theme="light" />
				{children}
			</body>
		</html>
	);
}
