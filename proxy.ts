import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

const ROOT_DOMAINS = ["besmart.com.br", "www.besmart.com.br", "localhost:3000"];
const SUBDOMAIN_SUFFIX = ".besmart.com.br";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get("admin_session");
    if (!session || session.value !== "authenticated") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // Roteamento das Landing Pages por host — só entra aqui em domínios que não
  // são o site principal (evita custo de consulta ao banco no tráfego normal).
  const isRootDomain = ROOT_DOMAINS.includes(host) || host.endsWith(".vercel.app");
  if (!isRootDomain) {
    if (host.endsWith(SUBDOMAIN_SUFFIX)) {
      const subdomain = host.slice(0, -SUBDOMAIN_SUFFIX.length);
      if (subdomain && subdomain !== "www") {
        return NextResponse.rewrite(new URL(`/lp/${subdomain}${pathname}`, request.url));
      }
    } else {
      const { data } = await supabase
        .from("landing_pages")
        .select("slug")
        .eq("dominio_customizado", host)
        .maybeSingle();
      if (data) {
        return NextResponse.rewrite(new URL(`/lp/${data.slug}${pathname}`, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
