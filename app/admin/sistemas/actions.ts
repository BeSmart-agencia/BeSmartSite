"use server";

import { supabase } from "@/app/lib/supabase";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";

// ── Chamados ─────────────────────────────────────────────────────────────────

export async function abrirChamado(clienteId: string, projetoId: string, formData: FormData) {
  const titulo = formData.get("titulo") as string;
  if (!titulo) return { error: "Título obrigatório." };

  const urgencia = (formData.get("urgencia") as string) || "normal";
  const prazo_resolucao = (formData.get("prazo_resolucao") as string) || null;

  const { error } = await supabase.from("chamados").insert({
    cliente_id: clienteId,
    projeto_id: projetoId,
    titulo,
    descricao: (formData.get("descricao") as string) || null,
    urgencia,
    prazo_resolucao,
    status: "aberto",
  });

  if (error) return { error: "Erro ao abrir chamado: " + error.message };

  revalidatePath("/admin/sistemas/chamados");
  return { success: true };
}

export async function responderChamado(chamadoId: string, formData: FormData) {
  const resposta = formData.get("resposta") as string;
  const status = (formData.get("status") as string) || "em andamento";

  const { error } = await supabase
    .from("chamados")
    .update({ resposta, status })
    .eq("id", chamadoId);

  if (error) return { error: error.message };
  revalidatePath("/admin/sistemas/chamados");
  return { success: true };
}

export async function atualizarStatusChamado(chamadoId: string, status: string) {
  const { error } = await supabase.from("chamados").update({ status }).eq("id", chamadoId);
  if (error) return { error: error.message };
  revalidatePath("/admin/sistemas/chamados");
  return { success: true };
}

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

// ── Clientes (edição) ─────────────────────────────────────────────────────────

export async function editarCliente(clienteId: string, formData: FormData) {
  const nome = formData.get("nome") as string;
  const empresa = formData.get("empresa") as string;
  if (!nome || !empresa) return { error: "Nome e empresa são obrigatórios." };

  const { error } = await supabase.from("clientes").update({
    nome,
    empresa,
    segmento: formData.get("segmento") || null,
    whatsapp: formData.get("whatsapp") || null,
    email: formData.get("email") || null,
    como_conheceu: formData.get("como_conheceu") || null,
    observacoes: formData.get("observacoes") || null,
  }).eq("id", clienteId);

  if (error) return { error: "Erro ao atualizar: " + error.message };
  revalidatePath(`/admin/sistemas/clientes/${clienteId}`);
  return { success: true };
}

// ── Projeto — checklist de processo e infraestrutura ─────────────────────────

const ALLOWED_PROJ_CAMPOS = new Set([
  "proc_diagnostico", "proc_proposta_enviada", "proc_contrato_assinado",
  "proc_entrada_recebida", "proc_entregue", "proc_onboarding", "proc_mensalidade_ativa",
  "infra_supabase_criado", "infra_colaboradora_adicionada", "infra_github_repo",
  "infra_vercel_deploy", "infra_dns_configurado", "infra_dominio_vercel",
]);

export async function toggleProjetoCheck(projetoId: string, campo: string, valor: boolean) {
  if (!ALLOWED_PROJ_CAMPOS.has(campo)) return { error: "Campo não permitido." };
  const { error } = await supabase.from("projetos").update({ [campo]: valor }).eq("id", projetoId);
  if (error) return { error: error.message };
  return { success: true };
}

export async function atualizarProposta(projetoId: string, formData: FormData, clienteId: string) {
  const { error } = await supabase.from("projetos").update({
    proposta_status: formData.get("proposta_status") || "nao_enviada",
    proposta_enviada_em: formData.get("proposta_enviada_em") || null,
    contrato_assinado_em: formData.get("contrato_assinado_em") || null,
  }).eq("id", projetoId);

  if (error) return { error: error.message };
  revalidatePath(`/admin/sistemas/clientes/${clienteId}/projeto/${projetoId}`);
  return { success: true };
}

export async function atualizarInfoProjeto(projetoId: string, formData: FormData, clienteId: string) {
  const { error } = await supabase.from("projetos").update({
    complexidade: formData.get("complexidade") || "medio",
    plano_mensalidade: formData.get("plano_mensalidade") || "starter",
    valor_mensalidade: formData.get("valor_mensalidade") ? Number(formData.get("valor_mensalidade")) : null,
    prazo_mensalidade_meses: formData.get("prazo_mensalidade_meses") ? Number(formData.get("prazo_mensalidade_meses")) : 6,
  }).eq("id", projetoId);

  if (error) return { error: error.message };
  revalidatePath(`/admin/sistemas/clientes/${clienteId}/projeto/${projetoId}`);
  return { success: true };
}

// ── Mensalidades ──────────────────────────────────────────────────────────────

export async function adicionarMensalidade(projetoId: string, formData: FormData) {
  const valor = Number(formData.get("valor"));
  const mes_referencia = formData.get("mes_referencia") as string;
  if (!valor || !mes_referencia) return { error: "Valor e mês são obrigatórios." };

  const { error } = await supabase.from("mensalidades").insert({
    projeto_id: projetoId,
    mes_referencia,
    plano: formData.get("plano") || "starter",
    valor,
    status: "pendente",
    data_vencimento: formData.get("data_vencimento") || null,
    observacoes: formData.get("observacoes") || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/sistemas/financeiro/mensalidades");
  return { success: true };
}

export async function marcarMensalidadePaga(mensalidadeId: string) {
  const { error } = await supabase.from("mensalidades")
    .update({ status: "pago", data_pagamento: new Date().toISOString().split("T")[0] })
    .eq("id", mensalidadeId);
  if (error) return { error: error.message };
  revalidatePath("/admin/sistemas/financeiro/mensalidades");
  return { success: true };
}

export async function marcarMensalidadePendente(mensalidadeId: string) {
  const { error } = await supabase.from("mensalidades")
    .update({ status: "pendente", data_pagamento: null })
    .eq("id", mensalidadeId);
  if (error) return { error: error.message };
  revalidatePath("/admin/sistemas/financeiro/mensalidades");
  return { success: true };
}

// ── Propostas (tabela própria) ────────────────────────────────────────────────

export async function criarProposta(clienteId: string) {
  const { data, error } = await supabase
    .from("propostas")
    .insert({ cliente_id: clienteId, status: "nao_enviada" })
    .select("id")
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/admin/sistemas/clientes/${clienteId}`);
  return { success: true, id: data.id };
}

export async function salvarProposta(propostaId: string, clienteId: string, conteudo: unknown) {
  const { error } = await supabase.from("propostas").update({ conteudo }).eq("id", propostaId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/sistemas/clientes/${clienteId}`);
  return { success: true };
}

export async function salvarPropostaStatus(propostaId: string, clienteId: string, status: string) {
  const { error } = await supabase.from("propostas").update({ status }).eq("id", propostaId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/sistemas/clientes/${clienteId}`);
  return { success: true };
}

export async function excluirProposta(propostaId: string, clienteId: string) {
  const { error } = await supabase.from("propostas").delete().eq("id", propostaId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/sistemas/clientes/${clienteId}`);
  return { success: true };
}

// kept for backward compat (old clientes.proposta_conteudo data)
export async function salvarPropostaCliente(clienteId: string, conteudo: unknown) {
  const { error } = await supabase.from("clientes").update({ proposta_conteudo: conteudo }).eq("id", clienteId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/sistemas/clientes/${clienteId}`);
  return { success: true };
}
export async function salvarPropostaStatusCliente(clienteId: string, status: string) {
  const { error } = await supabase.from("clientes").update({ proposta_status: status }).eq("id", clienteId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/sistemas/clientes/${clienteId}`);
  return { success: true };
}

export async function aceitarPropostaPortal(clienteId: string, planoEscolhido: "A" | "B", propostaId?: string) {
  if (propostaId) {
    const { data: proposta } = await supabase.from("propostas").select("conteudo").eq("id", propostaId).single();
    const conteudo = proposta?.conteudo as Record<string, unknown> | null;
    const { error } = await supabase.from("propostas")
      .update({ status: "aprovada", conteudo: { ...conteudo, plano_escolhido: planoEscolhido } })
      .eq("id", propostaId);
    if (error) return { error: error.message };
    const { data: cliente } = await supabase.from("clientes").select("empresa").eq("id", clienteId).single();
    const nomeSistema = (conteudo?.nome_sistema as string) || cliente?.empresa || "Novo Projeto";
    await supabase.from("projetos").insert({ cliente_id: clienteId, nome: nomeSistema, status: "Aprovado" });
    return { success: true };
  }
  // legacy: clientes.proposta_conteudo
  const { data: cliente } = await supabase.from("clientes").select("proposta_conteudo, empresa").eq("id", clienteId).single();
  const conteudo = cliente?.proposta_conteudo as Record<string, unknown> | null;
  const { error } = await supabase.from("clientes")
    .update({ proposta_status: "aprovada", proposta_conteudo: { ...conteudo, plano_escolhido: planoEscolhido } })
    .eq("id", clienteId);
  if (error) return { error: error.message };
  const nomeSistema = (conteudo?.nome_sistema as string) || cliente?.empresa || "Novo Projeto";
  await supabase.from("projetos").insert({ cliente_id: clienteId, nome: nomeSistema, status: "Aprovado" });
  return { success: true };
}

export async function recusarPropostaPortal(clienteId: string, propostaId?: string) {
  if (propostaId) {
    const { error } = await supabase.from("propostas").update({ status: "recusada" }).eq("id", propostaId);
    if (error) return { error: error.message };
    return { success: true };
  }
  const { error } = await supabase
    .from("clientes")
    .update({ proposta_status: "recusada" })
    .eq("id", clienteId);
  if (error) return { error: error.message };
  return { success: true };
}

export async function excluirProjeto(projetoId: string, clienteId: string) {
  await supabase.from("mensalidades").delete().eq("projeto_id", projetoId);
  await supabase.from("parcelas").delete().eq("projeto_id", projetoId);
  await supabase.from("etapas").delete().eq("projeto_id", projetoId);
  await supabase.from("itens_escopo").delete().eq("projeto_id", projetoId);
  const { error } = await supabase.from("projetos").delete().eq("id", projetoId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/sistemas/clientes/${clienteId}`);
  return { success: true };
}

export async function excluirCliente(clienteId: string) {
  await supabase.from("chamados").delete().eq("cliente_id", clienteId);
  await supabase.from("mensalidades").delete().in(
    "projeto_id",
    (await supabase.from("projetos").select("id").eq("cliente_id", clienteId)).data?.map((p) => p.id) ?? []
  );
  await supabase.from("parcelas").delete().in(
    "projeto_id",
    (await supabase.from("projetos").select("id").eq("cliente_id", clienteId)).data?.map((p) => p.id) ?? []
  );
  await supabase.from("etapas").delete().in(
    "projeto_id",
    (await supabase.from("projetos").select("id").eq("cliente_id", clienteId)).data?.map((p) => p.id) ?? []
  );
  await supabase.from("itens_escopo").delete().in(
    "projeto_id",
    (await supabase.from("projetos").select("id").eq("cliente_id", clienteId)).data?.map((p) => p.id) ?? []
  );
  await supabase.from("projetos").delete().eq("cliente_id", clienteId);
  await supabase.from("diagnosticos").delete().eq("cliente_id", clienteId);
  const { error } = await supabase.from("clientes").delete().eq("id", clienteId);
  if (error) return { error: error.message };
  revalidatePath("/admin/sistemas/clientes");
  return { success: true };
}

