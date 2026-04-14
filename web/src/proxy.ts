import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { isValidUser } from "./app/actions/auth/validate.action";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }
  const valid = await isValidUser();
  if (!valid) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|lottie)$).*)",
  ],
};
