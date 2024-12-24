import NextAuth from "next-auth";

// Extend the default types in next-auth
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;  // Add 'role' to session user
    };
  }

  interface JWT {
    id?: string;
    role?: string; // Add 'role' to JWT token
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;  // Ensure 'role' is part of the User interface
  }
}
