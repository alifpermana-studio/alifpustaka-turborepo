import type { Address, NextAuthOptions, Social } from "next-auth";
import { PrismaClient, UserRole, UserStatus } from "@repo/prisma-config";
import nodemailer from "nodemailer";
import { verificationHtml, verificationText } from "@/lib/mail/templates";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const prisma = new PrismaClient();

export const runtime = "nodejs"; // ensure Node runtime (not edge)

const isProduction = process.env.NODE_ENV === "production";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT || 587),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 60 * 15,
      async sendVerificationRequest({ identifier, url, provider }) {
        const host = new URL(url).host;

        // Email provider sendVerificationRequest(): only send to existing users
        const existing = await prisma.user.findUnique({
          where: { email: identifier },
        });
        if (!existing) return;

        // Nodemailer transport (Brevo SMTP)
        const transporter = nodemailer.createTransport(provider.server as any);

        const html = verificationHtml({
          url,
          host,
          appName: "Alif Pustaka",
          accent: "#0ea5e9", // <- your brand color
          logoUrl: "https://yourcdn.com/logo.png",
        });
        const text = verificationText({ url, host, appName: "Alif Pustaka" });

        await transporter.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Verify your email for ${host}`,
          text,
          html,
        });
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
        skipPassword: { label: "Skip Password", type: "text" },
        rememberMe: { label: "Remember Me", type: "boolean" },
      },
      async authorize(credentials) {
        const { identifier, password, rememberMe } = credentials ?? {};

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: identifier }, { username: identifier }],
          },
        });

        if (!user) throw new Error("user-not-found");

        if (!user.password) throw new Error("non-credential-user");

        if (user.password !== password) {
          throw new Error("credential-password-mismatch");
        }

        if (!user.emailVerified) throw new Error("unverified-user");

        let expires = Date.now();

        if (rememberMe === "true") {
          expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
        } else {
          expires = Date.now() + 1 * 24 * 60 * 60 * 1000;
        }

        return {
          id: user.id,
          fname: user.fname,
          lname: user.lname,
          username: user.username,
          emailVerified: user.emailVerified,
          email: user.email,
          bio: user.bio,
          userRole: user.userRole,
          userStatus: user.userStatus,
          image: user.image,
          phone: "+62 808 0808 0808",
          social: user.social as Social,
          address: user.address as Address,
          expires: expires,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  cookies: {
    sessionToken: {
      name: isProduction
        ? `__Secure-next-auth.session-token`
        : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        // Conditionally set the domain only in production
        ...(isProduction && { domain: ".alifpustaka.net" }),
      },
    },
    // ... other cookie configurations
  },

  callbacks: {
    async jwt({ token, user, trigger, account }) {
      /* console.log('Check jwt: ', user, token, account, trigger); */
      if (user) {
        token.id = user.id;
        token.fname = user.fname;
        token.lname = user.lname;
        token.username = user.username;
        token.email = user.email;
        token.phone = user.phone;
        token.image = user.image;
        token.bio = user.bio;
        token.emailVerified = user.emailVerified;
        token.userRole = user.userRole;
        token.userStatus = user.userStatus;
        token.social = user.social;
        token.address = user.address;
        if (account?.provider === "google") {
          token.expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
        } else if (account?.provider === "github") {
          token.expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
        } else if (account?.provider === "email") {
          token.expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
        } else {
          token.expires = user.expires;
        }
      }

      if (trigger === "update" && token) {
        const updatedUserFromDb = await getUpdatedUser(token.id as string);

        /* console.log('Update token: ', updatedUserFromDb); */

        if (updatedUserFromDb) {
          token.id = updatedUserFromDb.id;
          token.fname = updatedUserFromDb.fname;
          token.lname = updatedUserFromDb.lname;
          token.username = updatedUserFromDb.username;
          token.email = updatedUserFromDb.email;
          token.phone = updatedUserFromDb.phone;
          token.emailVerified = updatedUserFromDb.emailVerified;
          token.image = updatedUserFromDb.image;
          token.userRole = updatedUserFromDb.userRole;
          token.userStatus = updatedUserFromDb.userStatus;
          token.bio = updatedUserFromDb.bio;
          token.social = updatedUserFromDb.social;
          token.address = updatedUserFromDb.address;
          token.expires = token.expires;
        } else {
          console.error(
            `Failed to find user with ID: ${token.id} during session update.
           No updates were applied to the token.`
          );
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.emailVerified = token.emailVerified as Date;
        session.user.fname = token.fname as string;
        session.user.lname = token.lname as string;
        session.user.userRole = token.userRole as UserRole;
        session.user.userStatus = token.userStatus as UserStatus;
        session.user.phone = token.phone as string;
        session.user.bio = token.bio as string;
        session.user.image = token.image as string;
        session.user.username = token.username as string;
        session.user.social = token.social as Social;
        session.user.address = token.address as Address;
        session.user.expires = token.expires as number;
      }
      return session;
    },

    async redirect({ url }) {
      return url;
    },
  },
};

const getUpdatedUser = async (userId: string) => {
  try {
    const res = await prisma.user.findUnique({
      where: { id: userId },
    });

    /* console.log('Success fetch updated user: ', res); */

    return res;
  } catch (err) {
    console.error("Failed fetch user: ", err);
    return null;
  }
};
