"use server";

import { supabase } from "@/app/lib/supabase";
import { revalidatePath } from "next/cache";

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function gerarSlugUnico(base: string) {
  const raiz = slugify(base) || "cliente";
  let slug = raiz;
  let sufixo = 2;

  while (true) {
    const { data } = await supabase.from("landing_pages").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    slug = `${raiz}-${sufixo}`;
    sufixo++;
  }
}

export async function criarLandingPage(formData: FormData) {
  const nome_cliente = formData.get("nome_cliente") as string;
  const empresa = (formData.get("empresa") as string) || null;
  const whatsapp = (formData.get("whatsapp") as string) || null;
  const email = (formData.get("email") as string) || null;
  const plano = (formData.get("plano") as string) || "subdominio";
  const dominio_customizado = (formData.get("dominio_customizado") as string) || null;
  const titulo = (formData.get("titulo") as string) || null;
  const bio = (formData.get("bio") as string) || null;
  const cor_tema = (formData.get("cor_tema") as string) || "#9B6BB5";
  const avatar_url = (formData.get("avatar_url") as string) || null;

  if (!nome_cliente) return { error: "Nome do cliente é obrigatório." };
  if (plano === "dominio_proprio" && !dominio_customizado) {
    return { error: "Informe o domínio customizado para o plano de domínio próprio." };
  }

  const slug = await gerarSlugUnico(empresa || nome_cliente);

  const { data, error } = await supabase
    .from("landing_pages")
    .insert({
      slug,
      nome_cliente,
      empresa,
      whatsapp,
      email,
      plano,
      dominio_customizado,
      titulo,
      bio,
      cor_tema,
      avatar_url,
      links: [],
    })
    .select("id, slug")
    .single();

  if (error) return { error: "Erro ao salvar página: " + error.message };

  revalidatePath("/admin/landingpages");
  revalidatePath("/admin/landingpages/clientes");

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    success: true,
    id: data.id as string,
    slug: data.slug as string,
    link: `${base}/lp/${data.slug}`,
  };
}

export async function editarLandingPage(id: string, formData: FormData) {
  const nome_cliente = formData.get("nome_cliente") as string;
  const empresa = (formData.get("empresa") as string) || null;
  const whatsapp = (formData.get("whatsapp") as string) || null;
  const email = (formData.get("email") as string) || null;
  const plano = (formData.get("plano") as string) || "subdominio";
  const dominio_customizado = (formData.get("dominio_customizado") as string) || null;
  const titulo = (formData.get("titulo") as string) || null;
  const bio = (formData.get("bio") as string) || null;
  const cor_tema = (formData.get("cor_tema") as string) || "#9B6BB5";
  const avatar_url = (formData.get("avatar_url") as string) || null;

  if (!nome_cliente) return { error: "Nome do cliente é obrigatório." };
  if (plano === "dominio_proprio" && !dominio_customizado) {
    return { error: "Informe o domínio customizado para o plano de domínio próprio." };
  }

  const { error } = await supabase
    .from("landing_pages")
    .update({
      nome_cliente,
      empresa,
      whatsapp,
      email,
      plano,
      dominio_customizado,
      titulo,
      bio,
      cor_tema,
      avatar_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: "Erro ao atualizar página: " + error.message };

  revalidatePath("/admin/landingpages");
  revalidatePath(`/admin/landingpages/clientes/${id}`);
  return { success: true };
}

export async function atualizarLinksLandingPage(id: string, links: { label: string; url: string }[]) {
  const { error } = await supabase
    .from("landing_pages")
    .update({ links, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: "Erro ao atualizar links: " + error.message };

  revalidatePath(`/admin/landingpages/clientes/${id}`);
  return { success: true };
}

export async function atualizarStatusLandingPage(id: string, status: string) {
  const { error } = await supabase
    .from("landing_pages")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/landingpages");
  revalidatePath("/admin/landingpages/clientes");
  revalidatePath(`/admin/landingpages/clientes/${id}`);
  return { success: true };
}
