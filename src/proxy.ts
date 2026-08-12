import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/**
 * The main middleware function that intercepts requests.
 * It calls `updateSession` to refresh the user's Supabase auth cookie,
 * ensuring the session remains active during navigation.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

/**
 * The middleware configuration object.
 * The `matcher` specifies that this middleware should run on all paths except for
 * specific static assets and internal Next.js paths, which is an efficient way to apply it globally.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}