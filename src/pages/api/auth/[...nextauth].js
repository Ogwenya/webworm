import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectDB } from "@/utils/db";
import User from "@/models/userModel";

const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        await connectDB();

        const { username, password } = credentials;
        const user = await User.findOne({ username: username });

        if (user) {
          const isValidPassword = await compare(password, user.password);

          if (!isValidPassword) {
            throw new Error("Incorrect Password");
          }

          const sessionUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
          };

          return sessionUser;
        } else {
          throw new Error("Incorrect Username");
        }
      },
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
  },
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  callbacks: {
    async jwt({ token, trigger, user, session }) {
      if (trigger === "update" && session?.firstname) {
        token.firstname = session.firstname;
        token.lastname = session.lastname;
        token.username = session.username;
        token.email = session.email;
        token.id = session._id;
      }

      if (user) {
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.username = user.username;
        token.email = user.email;
        token.id = user._id;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.firstname = token.firstname;
      session.user.lastname = token.lastname;
      session.user.email = token.email;
      session.user.username = token.username;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
