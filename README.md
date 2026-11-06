# MontaFácil - App de Gestão para Montadores de Móveis

Um aplicativo web moderno e completo para gestão de serviços de montagem de móveis, migrado para a plataforma AI Studio com React, TypeScript, Vite e Tailwind CSS.

## 🚀 Funcionalidades

- **Visão Diária (Hoje)**: Resumo de faturamento previsto, serviços agendados, confirmações e rotas do dia.
- **Agenda Completa**: Visualização de agendamentos por data e status (Pendente, Confirmado, Concluído, Retorno, Cancelado), com busca e controle de retornos.
- **Cadastro de Clientes**: Gestão de clientes com telefone, endereço, notas e histórico completo de atendimentos.
- **Orçamentos & Propostas**: Elaboração de orçamentos detalhados por móvel/serviço, envio formatado via WhatsApp e conversão em agendamento com um clique.
- **Tabela de Preços & Calculadora Técnica**: Referência de valores médios de mercado por categoria (Quarto, Cozinha, Sala, Escritório, etc.) e calculadora de valor por hora técnica com deslocamento e complexidade.
- **Relatórios & Métricas**: Indicadores de faturamento realizado, previsto, ticket médio, taxa de conclusão e exportação de dados para CSV.
- **Configurações & Backup**: Personalização de mensagens de lembrete com tags automáticas (`{cliente}`, `{servico}`, etc.), link de avaliação do Google e backup/restauração via JSON.

## 🛠️ Tecnologias

- **Frontend**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite (porta 3000)
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **Armazenamento**: LocalStorage com dados iniciais demonstrativos e suporte a backup JSON

## 💻 Como Rodar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (porta 3000)
npm run dev

# Compilar para produção
npm run build
```