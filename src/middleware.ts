import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request });
  // ** Protecret Routes
  const ProtectedRoutes = ["/dashboard"];

  if (token === null && ProtectedRoutes?.includes(pathname)) {
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
}
