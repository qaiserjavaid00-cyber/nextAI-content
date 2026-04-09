import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // skip static files / _next
    if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico")) {
        return NextResponse.next();
    }
    // skip public paths
    if (pathname === "/" || pathname === "/membership") {
        return NextResponse.next();
    }

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // console.log("🟢 Middleware triggered:", pathname);
    // console.log("🟢 Token:", token);

    // 1️⃣ Protect dashboard & admin routes
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // 2️⃣ Protect admin route specifically
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // 3️⃣ Redirect logged-in users away from login/register
    if (token && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // 4️⃣ Everything else is fine
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register", "/membership"],
};