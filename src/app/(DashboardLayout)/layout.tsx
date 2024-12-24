import FullLayout from "@/app/(DashboardLayout)/layout/FullLayout";
import AuthProvider from "@/app/(components)/authentication/AuthProvider";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session: any = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body>
        {!session ? (
          <AuthProvider>{children}</AuthProvider>
        ) : (
          <FullLayout>{children}</FullLayout>
        )}
      </body>
    </html>
  );
}
