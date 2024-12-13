import FullLayout from "@/app/(DashboardLayout)/layout/FullLayout";
import AuthProvider from "@/app/(components)/authentication/AuthProvider";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NotificationProvider } from "../(context)/NotificationContext";
import { LiveDataProvider } from "../(context)/trolleyMoving/Trolley";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session: any = await getServerSession(authOptions);
  if (session?.status === "loading") {
    return <p> Loading.....</p>;
  }
  return (
    <html lang="en">
      <body>
        {!session ? (
          <AuthProvider>{children}</AuthProvider>
        ) : (
          <LiveDataProvider>
            <NotificationProvider>
              
              <FullLayout>{children}</FullLayout>
            </NotificationProvider>
          </LiveDataProvider>
        )}
      </body>
    </html>
  );
}
