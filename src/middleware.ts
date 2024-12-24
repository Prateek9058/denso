import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

type ProtectedRoutes = {
  [key: string]: string[];
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // console.log("pathname", pathname);

  if (pathname.startsWith("/_next/") || pathname.includes(".map")) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });
  // console.log("token", token?.role);

  type UserRole = "Admin" | "subAdmin";

  const protectedRoutes: ProtectedRoutes = {
    Admin: [
      "/dashboard",
      "/man-power-tracking",
      "/trolley",
      "/transactions",
      // "/maintenance",
      "/userManagement",
      "/alerts",
      "/department",
      "/settings",
    ],
    subAdmin: [
      "/dashboard",
      "/man-power-tracking",
      "/trolley",
      "/transactions",
      "/maintenance",
      "/alerts",
      "/department",
      "/settings",
    ],
  };

  const userRole: UserRole = token?.role === "Admin" ? "Admin" : "subAdmin";

  const isProtectedRoute = protectedRoutes[userRole]?.some((route: string) =>
    pathname.startsWith(route)
  );
  // console.log("isProtectedRoute", isProtectedRoute);

  if (isProtectedRoute && token === null) {
    return NextResponse.redirect(
      new URL(
        "/login?error=Please login first to access this route",
        request.url
      )
    );
  }

  if (token !== null && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // if (token !== null && !isProtectedRoute) {
  //   return NextResponse.redirect(
  //     new URL("/error?message=You cannot have permission", request.url)
  //   );
  // }

  return NextResponse.next();
}
