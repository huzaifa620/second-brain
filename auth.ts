import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "./lib/db";
import { compare } from "bcrypt";

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const user = await db.user.findUnique({
          where: { email: credentials?.email },
        });

        if (user) {
          const checkingPassword = await compare(
            credentials?.password || "",
            user.hashpassword
          );
          if (checkingPassword) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }

      return token;
    },
    session: ({ session, token, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },

    async signIn({ user, credentials }) {
      if (user) {
        return true;
      } else {
        return false;
      }
    },
  },

  pages: {
    signIn: "/login",
  },
} satisfies AuthOptions;
