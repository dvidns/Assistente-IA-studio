import React, { useState } from "react";
import { Plus, Calendar, Clock, MapPin, Search, Filter, MessageSquare, Edit3, Trash2, RotateCcw, ExternalLink } from "lucide-react";
import { Agendamento, StatusAgendamento, AppSettings } from "../types";
import { formatMoney, formatDateBR } from "../lib/utils";
import { StatusBadge } from "../components/StatusBadge";
import { WhatsAppShareModal } from "../components/WhatsAppShareModal";

interface AgendaViewProps {
  agendamentos: Agendamento[];
  onAddClick: () => void;
  onEditClick: (a: Agendamento) => void;
  onDeleteClick: (id: string) => void;
  onStatusChange: (id: string, newStatus: StatusAgendamento) => void;
  settings: AppSettings;
}

export function AgendaView({
  agendamentos,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onStatusChange,
  settings,
}: AgendaViewProps) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [dateFilter, setDateFilter] = useState<string>("all"); // "all" | date string
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [shareModalItem, setShareModalItem] = useState<Agendamento | null>(null);

  const filtered = agendamentos.filter((a) => {
    // Date filter
    if (dateFilter !== "all" && a.data !== dateFilter) {
      return false;
    }
    // Status filter
    if (statusFilter !== "todos" && a.status !== statusFilter) {
      return false;
    }
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchClient = a.clienteNome.toLowerCase().includes(q);
      const matchService = a.tipoServico.toLowerCase().includes(q);
      const matchAddress = (a.endereco || "").toLowerCase().includes(q);
      if (!matchClient && !matchService && !matchAddress) return false;
    }
    return true;
  }).sort((a, b) => {
    // Sort by date then time
    const cmpDate = a.data.localeCompare(b.data);
    if (cmpDate !== 0) return cmpDate;
    return a.hora.localeCompare(b.hora);
  });

  const buildReminderText = (item: Agendamento): string => {
    let tpl = settings.lembretePersonalizado || "Olá {cliente}! Confirmando o serviço de {servico} no dia {data} às {hora}. Valor: {valor}.";
    return tpl
      .replace(/{cliente}/g, item.clienteNome)
      .replace(/{servico}/g, item.tipoServico)
      .replace(/{data}/g, formatDateBR(item.data))
      .replace(/{hora}/g, item.hora)
      .replace(/{endereco}/g, item.endereco || "seu endereço")
      .replace(/{valor}/g, formatMoney(item.valor));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda Completa</h1>
          <p className="text-xs text-gray-500">Controle todos os seus atendimentos e retornos agendados</p>
        </div>
        <button
          onClick={onAddClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          + Novo Agendamento
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm space-y-3">
        {/* Date presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="text-gray-500 flex items-center gap-1 mr-1">
            <Calendar className="w-3.5 h-3.5" />
            Data:
          </span>
          <button
            onClick={() => setDateFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              dateFilter === "all" ? "bg-blue-600 text-white font-semibold" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todas as Datas
          </button>
          <button
            onClick={() => setDateFilter(todayStr)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              dateFilter === todayStr ? "bg-blue-600 text-white font-semibold" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Hoje
          </button>
          <button
            onClick={() => setDateFilter(tomorrowStr)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              dateFilter === tomorrowStr ? "bg-blue-600 text-white font-semibold" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Amanhã
          </button>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-gray-400">Escolher:</span>
            <input
              type="date"
              value={dateFilter === "all" ? "" : dateFilter}
              onChange={(e) => setDateFilter(e.target.value || "all")}
              className="text-xs px-2.5 py-1 border border-gray-200 rounded-lg bg-gray-50"
            />
          </div>
        </div>

        {/* Status and Search row */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100">
          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {["todos", "pendente", "confirmado", "concluido", "retorno", "cancelado"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                  statusFilter === st
                    ? "bg-gray-900 text-white font-semibold"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {st === "todos" ? "Todos os status" : st}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative sm:ml-auto w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente ou serviço..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Agendamentos List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200/80 rounded-2xl p-8 text-center shadow-sm">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-700 text-sm">Nenhum agendamento encontrado</h3>
            <p className="text-xs text-gray-400 mt-1">Tente ajustar seus filtros de data ou status.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Date & Time pill */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-center min-w-[70px]">
                    <span className="text-[10px] text-gray-500 font-bold block uppercase">
                      {formatDateBR(item.data)}
                    </span>
                    <span className="text-sm font-extrabold text-blue-600 block mt-0.5">
                      {item.hora}
                    </span>
                  </div>

                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 text-sm">{item.clienteNome}</h4>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-xs font-medium text-gray-700 mt-0.5">{item.tipoServico}</p>
                    {item.endereco && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate max-w-sm">{item.endereco}</span>
                        <a
                          href={`https://www.google.com/maps/search/${encodeURIComponent(item.endereco)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 ml-1"
                          title="Ver no Google Maps"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {item.temRetorno && (
                      <div className="inline-flex items-center gap-1 text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md mt-1 border border-purple-200">
                        <RotateCcw className="w-3 h-3" />
                        <span className="font-semibold">Retorno:</span> {formatDateBR(item.dataRetorno || "")} às {item.horaRetorno}
                        {item.motivoRetorno && ` (${item.motivoRetorno})`}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Value & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-gray-400 block uppercase">Valor</span>
                    <span className="text-sm font-extrabold text-emerald-600">
                      {formatMoney(item.valor)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <select
                      value={item.status}
                      onChange={(e) => onStatusChange(item.id, e.target.value as StatusAgendamento)}
                      className="text-xs font-semibold py-1.5 px-2 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white text-gray-700"
                    >
                      <option value="pendente">Pendente</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="concluido">Concluído</option>
                      <option value="retorno">Retorno</option>
                      <option value="cancelado">Cancelado</option>
                    </select>

                    <button
                      onClick={() => setShareModalItem(item)}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-200"
                      title="Enviar lembrete pelo WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onEditClick(item)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteClick(item.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {shareModalItem && (
        <WhatsAppShareModal
          isOpen={!!shareModalItem}
          onClose={() => setShareModalItem(null)}
          phone={shareModalItem.clienteTelefone}
          clientName={shareModalItem.clienteNome}
          initialMessage={buildReminderText(shareModalItem)}
        />
      )}
    </div>
  );
}
