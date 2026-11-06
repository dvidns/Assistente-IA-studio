import React, { useState } from "react";
import { BarChart3, Download, Printer, TrendingUp, CheckCircle, Clock, Calendar, DollarSign, RotateCcw } from "lucide-react";
import { Agendamento } from "../types";
import { formatMoney, formatDateBR } from "../lib/utils";
import { StatusBadge } from "../components/StatusBadge";

interface RelatoriosViewProps {
  agendamentos: Agendamento[];
}

export function RelatoriosView({ agendamentos }: RelatoriosViewProps) {
  const [periodo, setPeriodo] = useState<"hoje" | "7dias" | "mes" | "ano" | "todos">("mes");

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1).toISOString().slice(0, 10);

  const filtered = agendamentos.filter((a) => {
    if (periodo === "hoje") return a.data === todayStr;
    if (periodo === "7dias") return a.data >= sevenDaysAgo && a.data <= todayStr;
    if (periodo === "mes") return a.data >= firstDayOfMonth;
    if (periodo === "ano") return a.data >= firstDayOfYear;
    return true;
  });

  const concluidos = filtered.filter((a) => a.status === "concluido");
  const confirmados = filtered.filter((a) => a.status === "confirmado");
  const pendentes = filtered.filter((a) => a.status === "pendente");
  const retornos = filtered.filter((a) => a.status === "retorno");
  const cancelados = filtered.filter((a) => a.status === "cancelado");

  const totalFaturado = concluidos.reduce((s, a) => s + (a.valor || 0), 0);
  const totalPrevisto = filtered
    .filter((a) => a.status !== "cancelado")
    .reduce((s, a) => s + (a.valor || 0), 0);

  const ticketMedio = concluidos.length > 0 ? totalFaturado / concluidos.length : 0;

  const exportCSV = () => {
    const headers = ["Data", "Hora", "Cliente", "Telefone", "Servico", "Endereco", "Valor", "Status"];
    const rows = filtered.map((a) => [
      a.data,
      a.hora,
      `"${a.clienteNome.replace(/"/g, '""')}"`,
      `"${a.clienteTelefone}"`,
      `"${a.tipoServico.replace(/"/g, '""')}"`,
      `"${(a.endereco || "").replace(/"/g, '""')}"`,
      a.valor,
      a.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_montafacil_${periodo}_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatório Financeiro & Operacional</h1>
          <p className="text-xs text-gray-500">
            Acompanhe o faturamento, taxa de conclusão e exporte dados para controle contábil
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            <Download className="w-4 h-4 text-gray-500" />
            Exportar CSV
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Imprimir Relatório
          </button>
        </div>
      </div>

      {/* Period Selection */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border border-gray-200/80 shadow-sm text-xs font-medium">
        <span className="text-gray-400 px-2 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          Período:
        </span>
        {[
          { key: "hoje", label: "Hoje" },
          { key: "7dias", label: "Últimos 7 dias" },
          { key: "mes", label: "Este Mês" },
          { key: "ano", label: "Este Ano" },
          { key: "todos", label: "Todo o Histórico" },
        ].map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriodo(p.key as any)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              periodo === p.key
                ? "bg-blue-600 text-white font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Faturado (Concluídos)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{formatMoney(totalFaturado)}</div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            {concluidos.length} {concluidos.length === 1 ? "serviço concluído" : "serviços concluídos"}
          </span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Previsto (Total)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 mt-2">{formatMoney(totalPrevisto)}</div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            {filtered.filter((a) => a.status !== "cancelado").length} serviços no período
          </span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Ticket Médio</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-700 mt-2">{formatMoney(ticketMedio)}</div>
          <span className="text-[11px] text-gray-500 mt-1 block">Por serviço finalizado</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Taxa de Conclusão</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mt-2">
            {filtered.length > 0
              ? `${Math.round((concluidos.length / filtered.length) * 100)}%`
              : "0%"}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            {concluidos.length} de {filtered.length} serviços
          </span>
        </div>
      </div>

      {/* Breakdown by Status Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-center">
          <span className="text-[11px] font-bold text-emerald-800 uppercase block">Concluídos</span>
          <span className="text-lg font-black text-emerald-700">{concluidos.length}</span>
          <span className="text-[10px] text-emerald-600 block">{formatMoney(totalFaturado)}</span>
        </div>
        <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-center">
          <span className="text-[11px] font-bold text-blue-800 uppercase block">Confirmados</span>
          <span className="text-lg font-black text-blue-700">{confirmados.length}</span>
          <span className="text-[10px] text-blue-600">
            {formatMoney(confirmados.reduce((s, a) => s + a.valor, 0))}
          </span>
        </div>
        <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3 text-center">
          <span className="text-[11px] font-bold text-amber-800 uppercase block">Pendentes</span>
          <span className="text-lg font-black text-amber-700">{pendentes.length}</span>
          <span className="text-[10px] text-amber-600">
            {formatMoney(pendentes.reduce((s, a) => s + a.valor, 0))}
          </span>
        </div>
        <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-3 text-center">
          <span className="text-[11px] font-bold text-purple-800 uppercase block">Retornos</span>
          <span className="text-lg font-black text-purple-700">{retornos.length}</span>
          <span className="text-[10px] text-purple-600">Para finalizar</span>
        </div>
        <div className="bg-red-50/60 border border-red-100 rounded-xl p-3 text-center">
          <span className="text-[11px] font-bold text-red-800 uppercase block">Cancelados</span>
          <span className="text-lg font-black text-red-700">{cancelados.length}</span>
          <span className="text-[10px] text-red-500">Perdidos</span>
        </div>
      </div>

      {/* Appointments List for Period */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm">Detalhamento dos Atendimentos</h3>
          <span className="text-xs text-gray-500">{filtered.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase">
              <tr>
                <th className="py-2.5 px-4">Data / Hora</th>
                <th className="py-2.5 px-4">Cliente</th>
                <th className="py-2.5 px-4">Serviço</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    Nenhum registro encontrado no período selecionado.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70">
                    <td className="py-2.5 px-4 font-semibold text-gray-800">
                      {formatDateBR(item.data)} às {item.hora}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-gray-900">{item.clienteNome}</td>
                    <td className="py-2.5 px-4 text-gray-700">{item.tipoServico}</td>
                    <td className="py-2.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-2.5 px-4 text-right font-extrabold text-emerald-700">
                      {formatMoney(item.valor)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
