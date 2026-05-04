"use server";

import { supabase } from "@/app/lib/supabase";

export async function salvarOnboarding(clienteId: string, formData: FormData) {
  const empresa_descricao = formData.get("empresa_descricao") as string;
  if (!empresa_descricao) return { error: "Por favor, descreva sua empresa." };

  const payload = {
    cliente_id: clienteId,
    empresa_descricao,
    tempo_mercado: (formData.get("tempo_mercado") as string) || null,
    num_funcionarios: (formData.get("num_funcionarios") as string) || null,
    canais_venda: formData.getAll("canais_venda") as string[],
    resolver_uma_coisa: (formData.get("resolver_uma_coisa") as string) || null,
    prazo_importante: (formData.get("prazo_importante") as string) || null,
    observacoes_finais: (formData.get("observacoes_finais") as string) || null,
  };

  const { error } = await supabase
    .from("diagnosticos")
    .upsert(payload, { onConflict: "cliente_id" });

  if (error) return { error: "Erro ao salvar. Tente novamente." };

  return { success: true };
}
