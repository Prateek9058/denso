import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Next Auth",
      credentials: {
        email: { label: "Email", type: "text" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials: any, req: any) {
        const user: User = {
          id: "1",
          name: "J Smith1111",
          email: credentials?.email,
          role: credentials?.role,
        };

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
};
