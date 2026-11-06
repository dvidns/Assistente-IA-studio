import React, { useState } from "react";
import { Plus, FileText, MessageSquare, Edit3, Trash2, CalendarCheck, Check, Clock, X, ChevronDown } from "lucide-react";
import { Orcamento, Cliente, StatusOrcamento } from "../types";
import { formatMoney, formatDateBR } from "../lib/utils";
import { StatusBadge } from "../components/StatusBadge";
import { WhatsAppShareModal } from "../components/WhatsAppShareModal";

interface OrcamentosViewProps {
  orcamentos: Orcamento[];
  onAddClick: () => void;
  onEditClick: (o: Orcamento) => void;
  onDeleteClick: (id: string) => void;
  onStatusChange: (id: string, status: StatusOrcamento) => void;
  onConvertToAppointment: (o: Orcamento) => void;
}

export function OrcamentosView({
  orcamentos,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onStatusChange,
  onConvertToAppointment,
}: OrcamentosViewProps) {
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [shareModalData, setShareModalData] = useState<{ phone: string; name: string; message: string } | null>(null);

  const filtered = orcamentos.filter((o) => {
    if (statusFilter !== "todos" && o.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));

  const handleShareWhatsApp = (o: Orcamento) => {
    const itensStr = o.itens
      .map((i) => `• ${i.servicoNome} (x${i.quantidade}): ${formatMoney(i.valor * i.quantidade)}`)
      .join("\n");

    const msg = `Olá *${o.clienteNome}*! Segue seu orçamento de montagem de móveis:\n\n${itensStr}\n\n*VALOR TOTAL: ${formatMoney(o.total)}*\n\n${
      o.observacoes ? `Observações:\n${o.observacoes}\n\n` : ""
    }Fico à disposição para agendarmos o melhor dia e horário! 👍`;

    setShareModalData({
      phone: o.clienteTelefone,
      name: o.clienteNome,
      message: msg,
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orçamentos & Propostas</h1>
          <p className="text-xs text-gray-500">
            Gere cotações detalhadas, envie pelo WhatsApp e converta em agendamentos
          </p>
        </div>
        <button
          onClick={onAddClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          + Novo Orçamento
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-xs">
        {["todos", "pendente", "aprovado", "recusado"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg capitalize transition-colors font-medium ${
              statusFilter === st
                ? "bg-emerald-600 text-white font-semibold"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {st === "todos" ? "Todos os Orçamentos" : st}
          </button>
        ))}
        <span className="ml-auto text-gray-400 font-medium">
          {filtered.length} {filtered.length === 1 ? "registro" : "registros"}
        </span>
      </div>

      {/* List of Quotes */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-10 text-center shadow-sm">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-700 text-sm">Nenhum orçamento encontrado</h3>
          <p className="text-xs text-gray-400 mt-1 mb-4">Crie orçamentos para enviar propostas aos clientes.</p>
          <button
            onClick={onAddClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" />
            Criar Orçamento
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((orcamento) => (
            <div
              key={orcamento.id}
              className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base">{orcamento.clienteNome}</h3>
                    <StatusBadge status={orcamento.status} />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Criado em {formatDateBR(orcamento.criadoEm.slice(0, 10))} • Tel: {orcamento.clienteTelefone}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right mr-2">
                    <span className="text-[10px] text-gray-400 block uppercase">Total Proposta</span>
                    <span className="text-lg font-extrabold text-emerald-700">
                      {formatMoney(orcamento.total)}
                    </span>
                  </div>

                  {/* Status selector */}
                  <select
                    value={orcamento.status}
                    onChange={(e) => onStatusChange(orcamento.id, e.target.value as StatusOrcamento)}
                    className="text-xs font-semibold py-1.5 px-2.5 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white text-gray-700"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="recusado">Recusado</option>
                  </select>

                  <button
                    onClick={() => onEditClick(orcamento)}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200"
                    title="Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteClick(orcamento.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <div className="mt-3 bg-gray-50/60 rounded-xl p-3 border border-gray-100">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Itens da Montagem
                </span>
                <div className="space-y-1.5 text-xs">
                  {orcamento.itens.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-gray-200/50 last:border-0">
                      <span className="text-gray-800 font-medium">
                        {item.servicoNome} <span className="text-gray-500">x{item.quantidade}</span>
                      </span>
                      <span className="text-gray-700 font-bold">
                        {formatMoney(item.valor * item.quantidade)}
                      </span>
                    </div>
                  ))}
                </div>
                {orcamento.observacoes && (
                  <p className="mt-2 text-xs text-gray-500 italic bg-white p-2 rounded-lg border border-gray-200/60">
                    Obs: {orcamento.observacoes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={() => handleShareWhatsApp(orcamento)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Enviar via WhatsApp
                </button>

                <button
                  onClick={() => onConvertToAppointment(orcamento)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  Converter em Agendamento
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {shareModalData && (
        <WhatsAppShareModal
          isOpen={!!shareModalData}
          onClose={() => setShareModalData(null)}
          phone={shareModalData.phone}
          clientName={shareModalData.name}
          initialMessage={shareModalData.message}
        />
      )}
    </div>
  );
}
