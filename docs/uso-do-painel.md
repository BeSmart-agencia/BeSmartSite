# Guia de Uso — Painel Admin BeSmart Sistemas

Fluxo completo desde o primeiro contato com o cliente até a entrega e manutenção do projeto.

---

## 1. Cadastrar o cliente

**Menu → Novo Cliente**

Preenche nome, empresa, segmento, WhatsApp e e-mail. O sistema gera automaticamente o link de onboarding e o link do portal do cliente.

---

## 2. Fazer o diagnóstico

**Perfil do cliente → botão "Fazer Diagnóstico"**

Preenche o formulário de 7 blocos durante a reunião com o cliente (ou logo depois). O campo mais importante é *"Se você pudesse resolver uma coisa agora..."* — é ele que aparece destacado em todo o resto do sistema.

---

## 3. Criar o projeto

**Perfil do cliente → botão "Novo Projeto"**

Cria o projeto com nome e status inicial *"Em diagnóstico"*. A partir daí, tudo que acontece vive dentro desse projeto.

---

## 4. Trabalhar na aba Processo (a mais importante)

**Projeto → aba Processo**

É aqui que você acompanha tudo em ordem.

### Checklist do processo — vai marcando conforme acontece:

1. Diagnóstico realizado
2. Proposta enviada → atualiza o *Status da Proposta* para "Enviada" + coloca a data
3. Contrato assinado → coloca a data de assinatura
4. Entrada recebida (50%)
5. Sistema entregue
6. Onboarding realizado com a equipe
7. Mensalidade ativa

### Configurações do projeto — define aqui:

- **Complexidade:** Simples (R$ 3k–6k) / Médio (R$ 8k–15k) / Complexo (R$ 18k–35k)
- **Plano de mensalidade:** Starter / Pro / Agency
- **Valor da mensalidade**
- **Prazo mínimo de contrato:** 6 ou 12 meses

### Checklist de infraestrutura — vai marcando conforme configura:

1. Cliente criou a conta no Supabase
2. Você foi adicionada como colaboradora no projeto Supabase
3. Repositório criado no GitHub (BeSmart)
4. Deploy realizado na Vercel (sua conta)
5. DNS configurado pelo cliente (aponta para a Vercel)
6. Domínio adicionado na Vercel

---

## 5. Montar o escopo e as etapas

**Aba Escopo** → adiciona tudo que será entregue. Cada item vira um checklist que pode ser marcado como concluído ao longo do desenvolvimento.

**Aba Etapas** → divide o desenvolvimento em fases com prazo e responsável. O progresso aparece automaticamente na barra do projeto.

---

## 6. Registrar o financeiro de desenvolvimento

**Aba Financeiro → seção Desenvolvimento**

Adiciona as parcelas:

- **Parcela 1:** Entrada (50%) com data de vencimento
- **Parcela 2:** Entrega (50%) com data prevista

Marca como pago quando receber.

---

## 7. Avançar o status no Pipeline

**Menu → Pipeline**

Conforme o projeto avança, clica nas setinhas do card para mover de status:

```
Em diagnóstico → Proposta enviada → Aprovado → Em desenvolvimento → Entregue
```

---

## 8. Após a entrega — ativar mensalidades

**Aba Financeiro → seção Mensalidades de Suporte**

A partir do mês seguinte à entrega, adiciona uma mensalidade por mês com o valor do plano contratado. Marca como pago quando receber.

Para ver todos os clientes de uma vez: **Menu → Financeiro → Mensalidades**

---

## 9. Chamados durante o contrato

**Aba Chamados**

Qualquer bug ou solicitação do cliente entra aqui. Fica registrado com status e data — resolve e marca como resolvido.

> **Regra:** Bug = algo que parou de funcionar como entregue → coberto pela mensalidade.
> Nova feature = algo fora do escopo original → orçar à parte.

---

## Referência sempre à mão

**Menu → Processo & Preços**

Tabela de preços, planos, regras comerciais e checklist de infraestrutura — sem precisar abrir o documento do Google Drive.
