import React, { useState } from "react";
import { Plus, MapPin, Calendar, Clock, MessageSquare, Edit3, Trash2, CheckCircle2, ChevronRight, AlertCircle, ExternalLink } from "lucide-react";
import { Agendamento, StatusAgendamento, AppSettings } from "../types";
import { formatMoney, formatDateLongBR } from "../lib/utils";
import { StatusBadge } from "../components/StatusBadge";
import { WhatsAppShareModal } from "../components/WhatsAppShareModal";

interface TodayViewProps {
  agendamentos: Agendamento[];
  onAddClick: () => void;
  onEditClick: (a: Agendamento) => void;
  onDeleteClick: (id: string) => void;
  onStatusChange: (id: string, newStatus: StatusAgendamento) => void;
  settings: AppSettings;
}

export function TodayView({
  agendamentos,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onStatusChange,
  settings,
}: TodayViewProps) {
  const [shareModalItem, setShareModalItem] = useState<Agendamento | null>(null);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayItems = agendamentos
    .filter((a) => a.data === todayStr)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  const totalHoje = todayItems
    .filter((a) => a.status !== "cancelado")
    .reduce((sum, a) => sum + (a.valor || 0), 0);

  const confirmadosCount = todayItems.filter(
    (a) => a.status === "confirmado" || a.status === "concluido"
  ).length;

  const handleOpenWhatsApp = (item: Agendamento) => {
    setShareModalItem(item);
  };

  const buildReminderText = (item: Agendamento): string => {
    let tpl = settings.lembretePersonalizado || "Olá {cliente}! Confirmando o serviço de {servico} hoje às {hora}. Valor: {valor}.";
    return tpl
      .replace(/{cliente}/g, item.clienteNome)
      .replace(/{servico}/g, item.tipoServico)
      .replace(/{data}/g, "hoje (" + new Date().toLocaleDateString("pt-BR") + ")")
      .replace(/{hora}/g, item.hora)
      .replace(/{endereco}/g, item.endereco || "seu endereço")
      .replace(/{valor}/g, formatMoney(item.valor));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Visão Diária</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold capitalize mt-1">
              {formatDateLongBR(new Date())}
            </h1>
            <p className="text-blue-100 text-sm mt-0.5">
              Acompanhe sua rota e serviços agendados para hoje
            </p>
          </div>
          <button
            onClick={onAddClick}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 transition-all transform active:scale-95"
          >
            <Plus className="w-5 h-5 text-blue-600" />
            + Novo Agendamento
          </button>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3.5 border border-white/20">
            <span className="text-xs text-blue-100 block">Total de Serviços</span>
            <div className="text-2xl font-bold mt-1">{todayItems.length}</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3.5 border border-white/20">
            <span className="text-xs text-blue-100 block">Confirmados / Concluídos</span>
            <div className="text-2xl font-bold mt-1 text-emerald-200">{confirmadosCount}</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3.5 border border-white/20">
            <span className="text-xs text-blue-100 block">Faturamento Previsto</span>
            <div className="text-2xl font-bold mt-1 text-amber-200">{formatMoney(totalHoje)}</div>
          </div>
        </div>
      </div>

      {/* Today's Appointments List */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Horários de Hoje
          </h2>
          <span className="text-xs font-semibold text-gray-500">
            {todayItems.length} {todayItems.length === 1 ? "agendamento" : "agendamentos"}
          </span>
        </div>

        {todayItems.length === 0 ? (
          <div className="bg-white border border-gray-200/80 rounded-2xl p-10 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-800">Nenhum serviço agendado para hoje</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
              Aproveite para organizar seus orçamentos pendentes ou adicionar novos serviços na agenda.
            </p>
            <button
              onClick={onAddClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Adicionar Serviço
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {todayItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Time and Client info */}
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-50 text-blue-700 font-extrabold text-sm px-3 py-2 rounded-xl border border-blue-100 flex flex-col items-center justify-center min-w-[62px]">
                      <Clock className="w-3.5 h-3.5 mb-0.5 text-blue-500" />
                      {item.hora}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-base">{item.clienteNome}</span>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="text-sm font-medium text-gray-700 mt-0.5">{item.tipoServico}</p>
                      {item.endereco && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate max-w-md">{item.endereco}</span>
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
                        <div className="inline-flex items-center gap-1.5 text-xs text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md mt-1.5 border border-purple-200">
                          <span className="font-bold">Retorno agendado:</span>{" "}
                          {item.dataRetorno} às {item.horaRetorno} {item.motivoRetorno ? `• ${item.motivoRetorno}` : ""}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Value & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-gray-400 block">Valor</span>
                      <span className="text-base font-extrabold text-emerald-600">
                        {formatMoney(item.valor)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Quick Status Dropdown */}
                      <select
                        value={item.status}
                        onChange={(e) => onStatusChange(item.id, e.target.value as StatusAgendamento)}
                        className="text-xs font-semibold py-1.5 px-2.5 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white text-gray-700"
                        title="Alterar status"
                      >
                        <option value="pendente">Pendente</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="concluido">Concluído</option>
                        <option value="retorno">Retorno</option>
                        <option value="cancelado">Cancelado</option>
                      </select>

                      {/* WhatsApp Reminder */}
                      <button
                        onClick={() => handleOpenWhatsApp(item)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors"
                        title="Enviar lembrete pelo WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onEditClick(item)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteClick(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
