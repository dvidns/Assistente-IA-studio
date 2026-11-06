import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, MapPin, Plus, Trash2, RotateCcw, DollarSign } from "lucide-react";
import { Agendamento, Cliente, Servico, StatusAgendamento, ItemServicoAgendamento } from "../types";
import { formatMoney } from "../lib/utils";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appData: Omit<Agendamento, "id" | "criadoEm">) => void;
  clientes: Cliente[];
  servicos: Servico[];
  editingAppointment?: Agendamento | null;
  onQuickAddClient: (c: Omit<Cliente, "id" | "criadoEm">) => Cliente;
}

export function AppointmentModal({
  isOpen,
  onClose,
  onSave,
  clientes,
  servicos,
  editingAppointment,
  onQuickAddClient,
}: AppointmentModalProps) {
  const [selectedClientId, setSelectedClientId] = useState("");
  const [isNewClientMode, setIsNewClientMode] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");

  const [data, setData] = useState("");
  const [hora, setHora] = useState("09:00");
  const [tipoServico, setTipoServico] = useState("");
  const [descricao, setDescricao] = useState("");
  const [endereco, setEndereco] = useState("");
  const [valor, setValor] = useState<number>(100);
  const [status, setStatus] = useState<StatusAgendamento>("pendente");

  const [items, setItems] = useState<ItemServicoAgendamento[]>([]);
  const [temRetorno, setTemRetorno] = useState(false);
  const [dataRetorno, setDataRetorno] = useState("");
  const [horaRetorno, setHoraRetorno] = useState("14:00");
  const [motivoRetorno, setMotivoRetorno] = useState("");

  useEffect(() => {
    if (editingAppointment) {
      setSelectedClientId(editingAppointment.clienteId);
      setIsNewClientMode(false);
      setData(editingAppointment.data);
      setHora(editingAppointment.hora);
      setTipoServico(editingAppointment.tipoServico);
      setDescricao(editingAppointment.descricao || "");
      setEndereco(editingAppointment.endereco || "");
      setValor(editingAppointment.valor);
      setStatus(editingAppointment.status);
      setItems(editingAppointment.moveis || []);
      setTemRetorno(!!editingAppointment.temRetorno);
      setDataRetorno(editingAppointment.dataRetorno || "");
      setHoraRetorno(editingAppointment.horaRetorno || "14:00");
      setMotivoRetorno(editingAppointment.motivoRetorno || "");
    } else {
      const today = new Date().toISOString().slice(0, 10);
      setSelectedClientId(clientes[0]?.id || "");
      setIsNewClientMode(false);
      setNewClientName("");
      setNewClientPhone("");
      setData(today);
      setHora("09:00");
      setTipoServico("");
      setDescricao("");
      setEndereco(clientes[0]?.endereco || "");
      setValor(100);
      setStatus("pendente");
      setItems([]);
      setTemRetorno(false);
      setDataRetorno("");
      setHoraRetorno("14:00");
      setMotivoRetorno("");
    }
  }, [editingAppointment, isOpen, clientes]);

  if (!isOpen) return null;

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const cl = clientes.find((c) => c.id === clientId);
    if (cl && cl.endereco && !endereco) {
      setEndereco(cl.endereco + (cl.bairro ? ` - ${cl.bairro}` : ""));
    }
  };

  const handleAddServiceToItems = (serviceId: string) => {
    const s = servicos.find((srv) => srv.id === serviceId);
    if (!s) return;
    const existingIndex = items.findIndex((i) => i.servicoNome === s.nome);
    let newItems = [...items];
    if (existingIndex >= 0) {
      newItems[existingIndex].quantidade += 1;
    } else {
      newItems.push({
        id: "item_" + Math.random().toString(36).substring(2, 7),
        servicoNome: s.nome,
        valor: s.valorSugerido,
        quantidade: 1,
      });
    }
    setItems(newItems);
    recalcTotal(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    recalcTotal(newItems);
  };

  const handleItemQtyChange = (index: number, delta: number) => {
    const newItems = [...items];
    const newQty = newItems[index].quantidade + delta;
    if (newQty <= 0) {
      handleRemoveItem(index);
    } else {
      newItems[index].quantidade = newQty;
      setItems(newItems);
      recalcTotal(newItems);
    }
  };

  const handleItemPriceChange = (index: number, newPrice: number) => {
    const newItems = [...items];
    newItems[index].valor = Math.max(0, newPrice);
    setItems(newItems);
    recalcTotal(newItems);
  };

  const recalcTotal = (list: ItemServicoAgendamento[]) => {
    const sum = list.reduce((acc, curr) => acc + curr.valor * curr.quantidade, 0);
    if (sum > 0) {
      setValor(sum);
      setTipoServico(list.map((i) => (i.quantidade > 1 ? `${i.servicoNome} (x${i.quantidade})` : i.servicoNome)).join(" + "));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalClientId = selectedClientId;
    let finalClientNome = "";
    let finalClientPhone = "";

    if (isNewClientMode) {
      if (!newClientName.trim()) return alert("Informe o nome do novo cliente.");
      if (!newClientPhone.trim()) return alert("Informe o telefone do cliente.");
      const created = onQuickAddClient({
        nome: newClientName.trim(),
        telefone: newClientPhone.trim(),
        endereco: endereco.trim() || undefined,
      });
      finalClientId = created.id;
      finalClientNome = created.nome;
      finalClientPhone = created.telefone;
    } else {
      const found = clientes.find((c) => c.id === selectedClientId);
      if (!found) return alert("Selecione um cliente válido.");
      finalClientNome = found.nome;
      finalClientPhone = found.telefone;
    }

    const title = tipoServico.trim() || (items.length > 0 ? items.map((i) => i.servicoNome).join(" + ") : "Montagem de Móveis");

    onSave({
      clienteId: finalClientId,
      clienteNome: finalClientNome,
      clienteTelefone: finalClientPhone,
      data,
      hora,
      tipoServico: title,
      descricao: descricao.trim() || undefined,
      endereco: endereco.trim() || undefined,
      valor: Number(valor) || 0,
      status,
      moveis: items.length > 0 ? items : [{ id: "m1", servicoNome: title, valor: Number(valor) || 0, quantidade: 1 }],
      temRetorno,
      dataRetorno: temRetorno ? dataRetorno : undefined,
      horaRetorno: temRetorno ? horaRetorno : undefined,
      motivoRetorno: temRetorno ? motivoRetorno : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {editingAppointment ? "Editar Agendamento" : "Novo Agendamento"}
            </h3>
            <p className="text-xs text-gray-500">Agende serviços, defina valores e retornos</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Cliente Selection */}
          <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-blue-900 uppercase">Cliente *</label>
              <button
                type="button"
                onClick={() => setIsNewClientMode(!isNewClientMode)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
              >
                {isNewClientMode ? "Selecionar cliente existente" : "+ Cadastrar novo cliente"}
              </button>
            </div>

            {isNewClientMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Nome do cliente *"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white"
                />
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp / Telefone *"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  className="px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white"
                />
              </div>
            ) : (
              <select
                value={selectedClientId}
                onChange={(e) => handleClientChange(e.target.value)}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white font-medium text-gray-800"
              >
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} ({c.telefone}) {c.bairro ? `• ${c.bairro}` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Data & Hora */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Data *</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="date"
                  required
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Horário *</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="time"
                  required
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusAgendamento)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium"
              >
                <option value="pendente">Pendente</option>
                <option value="confirmado">Confirmado</option>
                <option value="concluido">Concluído</option>
                <option value="retorno">Retorno</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Serviços rápidos da tabela */}
          <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/50">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-700 uppercase">
                Adicionar Móvel / Serviço do Catálogo
              </label>
              <span className="text-xs text-gray-500">Clique para somar ao orçamento</span>
            </div>
            <div className="flex gap-2">
              <select
                id="catSelect"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddServiceToItems(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="w-full text-xs py-2 px-3 border border-gray-200 rounded-lg bg-white"
              >
                <option value="">Selecione um móvel para adicionar...</option>
                {servicos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome} • {formatMoney(s.valorSugerido)} ({s.categoria})
                  </option>
                ))}
              </select>
            </div>

            {/* Lista de itens selecionados */}
            {items.length > 0 && (
              <div className="mt-3 space-y-1.5 border-t border-gray-200 pt-2">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 text-xs"
                  >
                    <span className="font-medium text-gray-800">{item.servicoNome}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-200 rounded">
                        <button
                          type="button"
                          onClick={() => handleItemQtyChange(idx, -1)}
                          className="px-2 py-0.5 hover:bg-gray-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 font-medium">{item.quantidade}</span>
                        <button
                          type="button"
                          onClick={() => handleItemQtyChange(idx, 1)}
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
                          onChange={(e) => handleItemPriceChange(idx, Number(e.target.value))}
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

          {/* Título do Serviço e Valor Total */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Descrição do Serviço *
              </label>
              <input
                type="text"
                required
                value={tipoServico}
                onChange={(e) => setTipoServico(e.target.value)}
                placeholder="Ex: Guarda-roupa casal 6 portas + mesa"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Valor Total (R$) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                <input
                  type="number"
                  required
                  min="0"
                  step="5"
                  value={valor}
                  onChange={(e) => setValor(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm font-bold text-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Endereço da Montagem
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Rua, número, apto, bairro..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Observações / Detalhes
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={2}
              placeholder="Instruções de acesso, ferramentas especiais, etc."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
            />
          </div>

          {/* Retorno */}
          <div className="border border-purple-200 rounded-xl p-3 bg-purple-50/40">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="temRetorno"
                checked={temRetorno}
                onChange={(e) => setTemRetorno(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="temRetorno" className="text-xs font-bold text-purple-900 cursor-pointer flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
                Este serviço precisa de retorno para finalizar?
              </label>
            </div>

            {temRetorno && (
              <div className="mt-3 pt-3 border-t border-purple-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-purple-900 mb-1">Data do Retorno</label>
                  <input
                    type="date"
                    value={dataRetorno}
                    onChange={(e) => setDataRetorno(e.target.value)}
                    className="w-full px-3 py-1.5 border border-purple-200 rounded-lg text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-900 mb-1">Horário do Retorno</label>
                  <input
                    type="time"
                    value={horaRetorno}
                    onChange={(e) => setHoraRetorno(e.target.value)}
                    className="w-full px-3 py-1.5 border border-purple-200 rounded-lg text-xs bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-purple-900 mb-1">Motivo do Retorno</label>
                  <input
                    type="text"
                    value={motivoRetorno}
                    onChange={(e) => setMotivoRetorno(e.target.value)}
                    placeholder="Ex: Faltou parafuso de fábrica, cliente aguarda entrega do espelho..."
                    className="w-full px-3 py-1.5 border border-purple-200 rounded-lg text-xs bg-white"
                  />
                </div>
              </div>
            )}
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
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
            >
              Salvar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
