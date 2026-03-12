import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Faltan variables de entorno de Supabase en middleware");
    return NextResponse.next();
  }

  let response = NextResponse.next();

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    const isAuthPage =
      pathname === "/login" ||
      pathname === "/forgot" ||
      pathname === "/reset-password" ||
      pathname === "/support";

    const isPrivatePage = pathname.startsWith("/campus");

    if (isPrivatePage && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (isAuthPage && user) {
      const url = request.nextUrl.clone();
      url.pathname = "/campus";
      return NextResponse.redirect(url);
    }

    return response;
  } catch (error) {
    console.error("Error en middleware:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/login", "/forgot", "/reset-password", "/support", "/campus/:path*"],
};