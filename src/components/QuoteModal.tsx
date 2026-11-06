import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, FileText, CheckCircle2 } from "lucide-react";
import { Orcamento, Cliente, Servico, ItemOrcamento, StatusOrcamento } from "../types";
import { formatMoney } from "../lib/utils";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quoteData: Omit<Orcamento, "id" | "criadoEm">) => void;
  clientes: Cliente[];
  servicos: Servico[];
  editingQuote?: Orcamento | null;
}

export function QuoteModal({
  isOpen,
  onClose,
  onSave,
  clientes,
  servicos,
  editingQuote,
}: QuoteModalProps) {
  const [selectedClientId, setSelectedClientId] = useState("");
  const [itens, setItens] = useState<ItemOrcamento[]>([]);
  const [status, setStatus] = useState<StatusOrcamento>("pendente");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    if (editingQuote) {
      setSelectedClientId(editingQuote.clienteId);
      setItens(editingQuote.itens || []);
      setStatus(editingQuote.status);
      setObservacoes(editingQuote.observacoes || "");
    } else {
      setSelectedClientId(clientes[0]?.id || "");
      setItens([]);
      setStatus("pendente");
      setObservacoes("");
    }
  }, [editingQuote, isOpen, clientes]);

  if (!isOpen) return null;

  const handleAddService = (servicoId: string) => {
    const s = servicos.find((item) => item.id === servicoId);
    if (!s) return;
    const existingIndex = itens.findIndex((i) => i.servicoId === s.id);
    if (existingIndex >= 0) {
      const updated = [...itens];
      updated[existingIndex].quantidade += 1;
      setItens(updated);
    } else {
      setItens([
        ...itens,
        {
          servicoId: s.id,
          servicoNome: s.nome,
          quantidade: 1,
          valor: s.valorSugerido,
        },
      ]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setItens(itens.filter((_, idx) => idx !== index));
  };

  const handleQtyChange = (index: number, delta: number) => {
    const updated = [...itens];
    const newQty = updated[index].quantidade + delta;
    if (newQty <= 0) {
      handleRemoveItem(index);
    } else {
      updated[index].quantidade = newQty;
      setItens(updated);
    }
  };

  const handlePriceChange = (index: number, newPrice: number) => {
    const updated = [...itens];
    updated[index].valor = Math.max(0, newPrice);
    setItens(updated);
  };

  const total = itens.reduce((sum, item) => sum + item.valor * item.quantidade, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cl = clientes.find((c) => c.id === selectedClientId);
    if (!cl) return alert("Selecione um cliente.");
    if (itens.length === 0) return alert("Adicione pelo menos um item ao orçamento.");

    onSave({
      clienteId: cl.id,
      clienteNome: cl.nome,
      clienteTelefone: cl.telefone,
      itens,
      total,
      status,
      observacoes: observacoes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {editingQuote ? "Editar Orçamento" : "Novo Orçamento"}
              </h3>
              <p className="text-xs text-gray-500">Gere propostas de serviço e envie pelo WhatsApp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Cliente *
            </label>
            <select
              required
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white font-medium text-gray-800"
            >
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome} ({c.telefone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase">
                Adicionar Serviços do Catálogo
              </label>
              <span className="text-xs text-gray-500">Selecione para incluir</span>
            </div>
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  handleAddService(e.target.value);
                  e.target.value = "";
                }
              }}
              className="w-full text-xs py-2 px-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white"
            >
              <option value="">Clique para adicionar um item...</option>
              {servicos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome} • {formatMoney(s.valorSugerido)} ({s.categoria})
                </option>
              ))}
            </select>
          </div>

          {/* Itens adicionados */}
          <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/60 max-h-56 overflow-y-auto">
            {itens.length === 0 ? (
              <p className="text-xs text-center text-gray-400 py-4">Nenhum serviço adicionado ainda.</p>
            ) : (
              <div className="space-y-2">
                {itens.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-gray-200 text-xs"
                  >
                    <div className="flex-1 font-medium text-gray-800 truncate pr-2">
                      {item.servicoNome}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-200 rounded">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(idx, -1)}
                          className="px-2 py-0.5 hover:bg-gray-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 font-semibold">{item.quantidade}</span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(idx, 1)}
                          className="px-2 py-0.5 hover:bg-gray-100 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-400 mr-1">R$</span>
                        <input
                          type="number"
                          value={item.valor}
                          onChange={(e) => handlePriceChange(idx, Number(e.target.value))}
                          className="w-16 px-1.5 py-0.5 border border-gray-200 rounded text-right font-medium"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total & Status */}
          <div className="grid grid-cols-2 gap-3 items-center pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Status da Proposta
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusOrcamento)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold"
              >
                <option value="pendente">Pendente</option>
                <option value="aprovado">Aprovado</option>
                <option value="recusado">Recusado</option>
              </select>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-right">
              <span className="text-xs text-emerald-800 font-medium block">Total Estimado</span>
              <span className="text-lg font-bold text-emerald-700">{formatMoney(total)}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Observações / Condições de Pagamento
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={2}
              placeholder="Ex: Pagamento 50% na entrada e 50% na finalização via Pix. Validade 15 dias."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
            >
              Salvar Orçamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
