"use server";

import { supabase } from "@/app/lib/supabase";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";

function generateToken() {
  return randomBytes(20).toString("hex");
}

// ── Clientes ─────────────────────────────────────────────────────────────────

export async function cadastrarCliente(formData: FormData) {
  const nome = formData.get("nome") as string;
  const empresa = formData.get("empresa") as string;
  const segmento = formData.get("segmento") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const email = formData.get("email") as string;
  const como_conheceu = formData.get("como_conheceu") as string;
  const observacoes = formData.get("observacoes") as string;

  if (!nome || !empresa) return { error: "Nome e empresa são obrigatórios." };

  const onboarding_token = generateToken();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const link = `${base}/onboarding/${onboarding_token}`;

  const { data, error } = await supabase
    .from("clientes")
    .insert({ nome, empresa, segmento, whatsapp, email, como_conheceu, observacoes, onboarding_token, status: "ativo" })
    .select("id")
    .single();

  if (error) return { error: "Erro ao salvar cliente: " + error.message };

  revalidatePath("/admin/sistemas");
  return { success: true, link, clienteId: data.id as string };
}

// ── Diagnóstico ──────────────────────────────────────────────────────────────

export async function salvarDiagnostico(clienteId: string, formData: FormData) {
  function str(key: string) { return (formData.get(key) as string) || null; }
  function bool(key: string) { const v = formData.get(key); return v === "sim" ? true : v === "nao" ? false : null; }
  function arr(key: string) { return formData.getAll(key) as string[]; }

  const payload = {
    cliente_id: clienteId,
    empresa_descricao: str("empresa_descricao"),
    tempo_mercado: str("tempo_mercado"),
    num_funcionarios: str("num_funcionarios"),
    canais_venda: arr("canais_venda"),
    ferramentas_atuais: str("ferramentas_atuais"),
    tarefas_mais_tempo: str("tarefas_mais_tempo"),
    o_que_automatizar: str("o_que_automatizar"),
    ferramentas_integradas: bool("ferramentas_integradas"),
    ferramentas_integradas_obs: str("ferramentas_integradas_obs"),
    processos_parados: bool("processos_parados"),
    processos_parados_qual: str("processos_parados_qual"),
    como_chegam_leads: arr("como_chegam_leads"),
    quem_responde_leads: str("quem_responde_leads"),
    tempo_resposta: str("tempo_resposta"),
    perde_clientes: bool("perde_clientes"),
    perde_clientes_freq: str("perde_clientes_freq"),
    tem_script: bool("tem_script"),
    taxa_conversao: str("taxa_conversao"),
    controle_tarefas: str("controle_tarefas"),
    onboarding_cliente: str("onboarding_cliente"),
    tempo_novo_cliente: str("tempo_novo_cliente"),
    controle_pagamentos: bool("controle_pagamentos"),
    controle_pagamentos_como: str("controle_pagamentos_como"),
    onde_retrabalho: str("onde_retrabalho"),
    como_prospecta: str("como_prospecta"),
    prospeccao_ativa: bool("prospeccao_ativa"),
    prospeccao_ativa_como: str("prospeccao_ativa_como"),
    maior_obstaculo: str("maior_obstaculo"),
    resolver_uma_coisa: str("resolver_uma_coisa"),
    o_que_tira_sono: str("o_que_tira_sono"),
    tentou_resolver: str("tentou_resolver"),
    impacto_resolucao: str("impacto_resolucao"),
    prazo_importante: str("prazo_importante"),
    orcamento: str("orcamento"),
    preferencia_pagamento: str("preferencia_pagamento"),
    contato_interno_nome: str("contato_interno_nome"),
    contato_interno_wa: str("contato_interno_wa"),
    tem_tecnico: bool("tem_tecnico"),
    prazo_entrega: str("prazo_entrega"),
    observacoes_finais: str("observacoes_finais"),
  };

  const { error } = await supabase.from("diagnosticos").upsert(
    { ...payload },
    { onConflict: "cliente_id" }
  );

  if (error) return { error: "Erro ao salvar: " + error.message };

  revalidatePath(`/admin/sistemas/clientes/${clienteId}`);
  return { success: true };
}

// ── Projetos ─────────────────────────────────────────────────────────────────

export async function criarProjeto(clienteId: string, formData: FormData) {
  const nome = formData.get("nome") as string;
  if (!nome) return { error: "Nome do projeto obrigatório." };

  const { data, error } = await supabase
    .from("projetos")
    .insert({
      cliente_id: clienteId,
      nome,
      descricao: formData.get("descricao") || null,
      status: formData.get("status") || "Em diagnóstico",
      data_inicio: formData.get("data_inicio") || null,
      prazo_entrega: formData.get("prazo_entrega") || null,
      valor_total: formData.get("valor_total") ? Number(formData.get("valor_total")) : null,
      forma_pagamento: formData.get("forma_pagamento") || null,
    })
    .select("id")
    .single();

  if (error) return { error: "Erro ao criar projeto: " + error.message };

  revalidatePath(`/admin/sistemas/clientes/${clienteId}`);
  return { success: true, projetoId: data.id as string };
}

export async function atualizarStatusProjeto(projetoId: string, status: string, clienteId: string) {
  const { error } = await supabase.from("projetos").update({ status }).eq("id", projetoId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/sistemas/clientes/${clienteId}`);
  return { success: true };
}

// ── Escopo ───────────────────────────────────────────────────────────────────

export async function adicionarItemEscopo(projetoId: string, descricao: string) {
  const { error } = await supabase.from("itens_escopo").insert({ projeto_id: projetoId, descricao });
  if (error) return { error: error.message };
  revalidatePath("/admin/sistemas");
  return { success: true };
}

export async function toggleItemEscopo(itemId: string, concluido: boolean) {
  const { error } = await supabase.from("itens_escopo").update({ concluido }).eq("id", itemId);
  if (error) return { error: error.message };
  return { success: true };
}

// ── Etapas ───────────────────────────────────────────────────────────────────

export async function adicionarEtapa(projetoId: string, formData: FormData) {
  const { error } = await supabase.from("etapas").insert({
    projeto_id: projetoId,
    nome: formData.get("nome"),
    responsavel: formData.get("responsavel") || null,
    prazo: formData.get("prazo") || null,
    status: "a fazer",
  });
  if (error) return { error: error.message };
  return { success: true };
}

export async function atualizarStatusEtapa(etapaId: string, status: string) {
  const { error } = await supabase.from("etapas").update({ status }).eq("id", etapaId);
  if (error) return { error: error.message };
  return { success: true };
}

// ── Parcelas ─────────────────────────────────────────────────────────────────

export async function adicionarParcela(projetoId: string, formData: FormData) {
  const { error } = await supabase.from("parcelas").insert({
    projeto_id: projetoId,
    valor: Number(formData.get("valor")),
    vencimento: formData.get("vencimento") || null,
    status: "pendente",
    descricao: formData.get("descricao") || null,
  });
  if (error) return { error: error.message };
  return { success: true };
}

export async function marcarParcelaPaga(parcelaId: string) {
  const { error } = await supabase.from("parcelas").update({ status: "pago" }).eq("id", parcelaId);
  if (error) return { error: error.message };
  return { success: true };
}
