import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

const SESSION_COOKIE_NAME = "yankee_admin_session";
const JWT_SECRET = process.env.NEXTAUTH_SECRET || "default_yankee_gadgets_jwt_secret_phrase_for_auth_encryption";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Paths requiring Admin/Staff Gating
  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (isAdminPath) {
    const sessionToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    
    // Validate session JWT
    let session = null;
    if (sessionToken) {
      session = await verifyJWT(sessionToken, JWT_SECRET);
    }

    if (isLoginPage) {
      // If user is already logged in as Admin/Staff, redirect to Dashboard home
      if (session && (session.role === "ADMIN" || session.role === "STAFF")) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }

    // Redirect to Login if session is invalid or missing
    if (!session || (session.role !== "ADMIN" && session.role !== "STAFF")) {
      const redirectUrl = new URL("/admin/login", req.url);
      // Optional: carry redirect destination url parameters
      redirectUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

// Config to specify matching route paths
export const config = {
  matcher: ["/admin/:path*"],
};
