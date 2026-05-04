-- ============================================================
-- BeSmart · Painel Sistemas Sob Medida — Supabase Schema
-- Execute no SQL Editor do Supabase (painel > SQL Editor)
-- ============================================================

-- 1. Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome            TEXT NOT NULL,
  empresa         TEXT NOT NULL,
  segmento        TEXT,
  whatsapp        TEXT,
  email           TEXT,
  como_conheceu   TEXT,
  observacoes     TEXT,
  onboarding_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(20), 'hex'),
  status          TEXT DEFAULT 'ativo',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Diagnósticos (um por cliente)
CREATE TABLE IF NOT EXISTS diagnosticos (
  id                        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id                UUID REFERENCES clientes(id) ON DELETE CASCADE UNIQUE,
  -- Bloco 1 — Empresa
  empresa_descricao         TEXT,
  tempo_mercado             TEXT,
  num_funcionarios          TEXT,
  canais_venda              TEXT[],
  ferramentas_atuais        TEXT,
  -- Bloco 2 — Operação
  tarefas_mais_tempo        TEXT,
  o_que_automatizar         TEXT,
  ferramentas_integradas    BOOLEAN,
  ferramentas_integradas_obs TEXT,
  processos_parados         BOOLEAN,
  processos_parados_qual    TEXT,
  -- Bloco 3 — Atendimento
  como_chegam_leads         TEXT[],
  quem_responde_leads       TEXT,
  tempo_resposta            TEXT,
  perde_clientes            BOOLEAN,
  perde_clientes_freq       TEXT,
  tem_script                BOOLEAN,
  taxa_conversao            TEXT,
  -- Bloco 4 — Processos
  controle_tarefas          TEXT,
  onboarding_cliente        TEXT,
  tempo_novo_cliente        TEXT,
  controle_pagamentos       BOOLEAN,
  controle_pagamentos_como  TEXT,
  onde_retrabalho           TEXT,
  -- Bloco 5 — Prospecção
  como_prospecta            TEXT,
  prospeccao_ativa          BOOLEAN,
  prospeccao_ativa_como     TEXT,
  maior_obstaculo           TEXT,
  -- Bloco 6 — Dores
  resolver_uma_coisa        TEXT,
  o_que_tira_sono           TEXT,
  tentou_resolver           TEXT,
  impacto_resolucao         TEXT,
  prazo_importante          TEXT,
  -- Bloco 7 — Contexto
  orcamento                 TEXT,
  preferencia_pagamento     TEXT,
  contato_interno_nome      TEXT,
  contato_interno_wa        TEXT,
  tem_tecnico               BOOLEAN,
  prazo_entrega             TEXT,
  observacoes_finais        TEXT,
  created_at                TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Projetos
CREATE TABLE IF NOT EXISTS projetos (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id      UUID REFERENCES clientes(id) ON DELETE CASCADE,
  nome            TEXT NOT NULL,
  descricao       TEXT,
  status          TEXT DEFAULT 'Em diagnóstico',
  data_inicio     DATE,
  prazo_entrega   DATE,
  valor_total     NUMERIC(10,2),
  forma_pagamento TEXT,
  observacoes_tecnicas TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Itens de Escopo
CREATE TABLE IF NOT EXISTS itens_escopo (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  projeto_id  UUID REFERENCES projetos(id) ON DELETE CASCADE,
  descricao   TEXT NOT NULL,
  concluido   BOOLEAN DEFAULT FALSE,
  ordem       INT DEFAULT 0
);

-- 5. Etapas
CREATE TABLE IF NOT EXISTS etapas (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  projeto_id  UUID REFERENCES projetos(id) ON DELETE CASCADE,
  nome        TEXT NOT NULL,
  responsavel TEXT,
  prazo       DATE,
  status      TEXT DEFAULT 'a fazer',
  ordem       INT DEFAULT 0
);

-- 6. Parcelas
CREATE TABLE IF NOT EXISTS parcelas (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  projeto_id  UUID REFERENCES projetos(id) ON DELETE CASCADE,
  valor       NUMERIC(10,2) NOT NULL,
  vencimento  DATE,
  status      TEXT DEFAULT 'pendente',
  descricao   TEXT
);

-- ============================================================
-- Row Level Security — desabilitar para acesso via service_key
-- (o painel usa service_role, não autenticação de usuário)
-- ============================================================
ALTER TABLE clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosticos DISABLE ROW LEVEL SECURITY;
ALTER TABLE projetos DISABLE ROW LEVEL SECURITY;
ALTER TABLE itens_escopo DISABLE ROW LEVEL SECURITY;
ALTER TABLE etapas DISABLE ROW LEVEL SECURITY;
ALTER TABLE parcelas DISABLE ROW LEVEL SECURITY;
