import React, { useState } from "react";
import { Plus, Search, User, Phone, MapPin, MessageSquare, Edit3, Trash2, Calendar, FileText, ChevronRight, X } from "lucide-react";
import { Cliente, Agendamento } from "../types";
import { formatPhone, formatDateBR, formatMoney, openWhatsAppLink } from "../lib/utils";
import { StatusBadge } from "../components/StatusBadge";

interface ClientesViewProps {
  clientes: Cliente[];
  agendamentos: Agendamento[];
  onAddClick: () => void;
  onEditClick: (c: Cliente) => void;
  onDeleteClick: (id: string) => void;
  onNewAppointmentWithClient: (c: Cliente) => void;
}

export function ClientesView({
  clientes,
  agendamentos,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onNewAppointmentWithClient,
}: ClientesViewProps) {
  const [search, setSearch] = useState("");
  const [viewHistoryClient, setViewHistoryClient] = useState<Cliente | null>(null);

  const filtered = clientes.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.nome.toLowerCase().includes(q) ||
      c.telefone.includes(q) ||
      (c.bairro && c.bairro.toLowerCase().includes(q)) ||
      (c.endereco && c.endereco.toLowerCase().includes(q))
    );
  });

  const getClientAppointments = (clientId: string) => {
    return agendamentos.filter((a) => a.clienteId === clientId);
  };

  const handleWhatsAppContact = (c: Cliente) => {
    const msg = `Olá ${c.nome}! Tudo bem? Aqui é da equipe de montagem de móveis MontaFácil. Em que posso te ajudar hoje?`;
    openWhatsAppLink(c.telefone, msg);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Base de Clientes</h1>
          <p className="text-xs text-gray-500">
            Gerencie contatos, histórico de montagens e canais de atendimento
          </p>
        </div>
        <button
          onClick={onAddClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          + Novo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, telefone, bairro ou endereço..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      {/* Grid of Clients */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-10 text-center shadow-sm">
          <User className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-700 text-sm">Nenhum cliente cadastrado</h3>
          <p className="text-xs text-gray-400 mt-1 mb-4">Adicione seus clientes para manter contatos e histórico.</p>
          <button
            onClick={onAddClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Cliente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((client) => {
            const clientApps = getClientAppointments(client.id);
            const totalGasto = clientApps
              .filter((a) => a.status === "concluido")
              .reduce((s, a) => s + (a.valor || 0), 0);

            return (
              <div
                key={client.id}
                className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                        {client.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">{client.nome}</h3>
                        <p className="text-xs font-medium text-gray-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {formatPhone(client.telefone)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleWhatsAppContact(client)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-200"
                        title="Conversar no WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditClick(client)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200"
                        title="Editar cliente"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteClick(client.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                        title="Excluir cliente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Address and details */}
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-xs text-gray-600">
                    {client.endereco && (
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                        <span>
                          {client.endereco} {client.bairro ? `(${client.bairro})` : ""}
                        </span>
                      </div>
                    )}
                    {client.notas && (
                      <div className="flex items-start gap-1.5 text-gray-500 italic">
                        <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                        <span>{client.notas}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom stats and action */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div className="text-gray-500">
                    <span className="font-semibold text-gray-800">{clientApps.length}</span> serviços •{" "}
                    <span className="font-semibold text-emerald-700">{formatMoney(totalGasto)}</span> total
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewHistoryClient(client)}
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      Histórico
                    </button>
                    <button
                      onClick={() => onNewAppointmentWithClient(client)}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100"
                    >
                      + Agendar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History Modal */}
      {viewHistoryClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Histórico de Atendimentos</h3>
                <p className="text-xs text-gray-500">{viewHistoryClient.nome}</p>
              </div>
              <button
                onClick={() => setViewHistoryClient(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto space-y-2.5 pr-1">
              {getClientAppointments(viewHistoryClient.id).length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">
                  Nenhum atendimento registrado ainda para este cliente.
                </p>
              ) : (
                getClientAppointments(viewHistoryClient.id).map((a) => (
                  <div
                    key={a.id}
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">
                          {formatDateBR(a.data)} às {a.hora}
                        </span>
                        <StatusBadge status={a.status} />
                      </div>
                      <p className="text-gray-600 mt-1">{a.tipoServico}</p>
                    </div>
                    <span className="font-extrabold text-emerald-700 text-sm">
                      {formatMoney(a.valor)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setViewHistoryClient(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
