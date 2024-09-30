import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Next Auth",
      credentials: {},
      async authorize(credentials: any, req: any) {
        const user = { id: "1", name: "J Smith", email: credentials?.email };
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
};
