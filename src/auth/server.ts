import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { emailHarmony } from "better-auth-harmony";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		requireEmailVerification: true,
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, token }) => {
			await resend.emails.send({
				from: "Renegent <noreply@renegent.dev>",
				to: user.email,
				subject: "Verify your email - Welcome to Renegent!",
				text: `
					Welcome to Renegent!
					Please verify your email by clicking the link below:
					${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}&email=${user.email}
				`,
			});
		},
	},
	plugins: [emailHarmony()],
});
