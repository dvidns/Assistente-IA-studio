import React, { useState } from "react";
import { Plus, Calculator, Wrench, Edit3, Trash2, Check, X } from "lucide-react";
import { Servico, AppSettings } from "../types";
import { formatMoney } from "../lib/utils";

interface ServicosViewProps {
  servicos: Servico[];
  onAddServico: (s: Omit<Servico, "id">) => void;
  onUpdateServico: (id: string, s: Partial<Servico>) => void;
  onDeleteServico: (id: string) => void;
  settings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
}

export function ServicosView({
  servicos,
  onAddServico,
  onUpdateServico,
  onDeleteServico,
  settings,
  onUpdateSettings,
}: ServicosViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New Service Form State
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("Quarto");
  const [valorMin, setValorMin] = useState(80);
  const [valorMax, setValorMax] = useState(150);
  const [valorSugerido, setValorSugerido] = useState(100);
  const [tempoEstimado, setTempoEstimado] = useState(1.5);

  // Calculator State
  const [calcHoras, setCalcHoras] = useState<number>(2.5);
  const [calcTaxaDeslocamento, setCalcTaxaDeslocamento] = useState<number>(30);
  const [calcComplexidade, setCalcComplexidade] = useState<number>(1); // 1 = normal, 1.2 = alta, 1.4 = drywall/vidro

  const categories = ["todos", "Quarto", "Cozinha", "Sala", "Escritório", "Desmontagem", "Outros"];

  const filtered = servicos.filter((s) => {
    if (selectedCategory !== "todos" && s.categoria !== selectedCategory) return false;
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return alert("Informe o nome do móvel/serviço.");
    onAddServico({
      nome: nome.trim(),
      categoria,
      valorMin: Number(valorMin),
      valorMax: Number(valorMax),
      valorSugerido: Number(valorSugerido),
      tempoEstimadoHoras: Number(tempoEstimado),
    });
    setNome("");
    setShowAddModal(false);
  };

  const calculatedTotal = calcHoras * settings.valorHora * calcComplexidade + calcTaxaDeslocamento;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tabela de Serviços & Preços</h1>
          <p className="text-xs text-gray-500">
            Valores de referência para o mercado brasileiro de montagem de móveis
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          + Novo Serviço
        </button>
      </div>

      {/* Hourly Rate Calculator Box */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-200/80 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">Calculadora de Preço por Hora Técnica</h3>
            <p className="text-xs text-gray-600">
              Estime o orçamento baseado no tempo de execução e complexidade da montagem
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Sua Hora Técnica (R$/h)
            </label>
            <input
              type="number"
              value={settings.valorHora}
              onChange={(e) => onUpdateSettings({ ...settings, valorHora: Number(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-sm font-bold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Tempo Estimado (Horas)
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              value={calcHoras}
              onChange={(e) => setCalcHoras(Number(e.target.value) || 0.5)}
              className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-sm font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Taxa de Deslocamento (R$)
            </label>
            <input
              type="number"
              value={calcTaxaDeslocamento}
              onChange={(e) => setCalcTaxaDeslocamento(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-sm font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Complexidade
            </label>
            <select
              value={calcComplexidade}
              onChange={(e) => setCalcComplexidade(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs font-semibold text-gray-800"
            >
              <option value="1">Padrão / MDF Simples (1.0x)</option>
              <option value="1.2">Alta / Muitas Gavetas (1.2x)</option>
              <option value="1.4">Especial / Parede Drywall/Vidro (1.4x)</option>
            </select>
          </div>
        </div>

        {/* Calculated Result Card */}
        <div className="mt-4 pt-4 border-t border-blue-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-xs text-gray-600">
            Fórmula: ({calcHoras}h × {formatMoney(settings.valorHora)} × {calcComplexidade}x) + {formatMoney(calcTaxaDeslocamento)} deslocamento
          </span>
          <div className="bg-white px-4 py-2 rounded-xl border border-blue-200 flex items-center gap-3 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold uppercase">Preço Recomendado:</span>
            <span className="text-xl font-extrabold text-blue-700">{formatMoney(calculatedTotal)}</span>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-blue-600 text-white font-semibold shadow-sm"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {cat === "todos" ? "Todas as Categorias" : cat}
          </button>
        ))}
      </div>

      {/* Table of Services */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Móvel / Serviço</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4 text-center">Faixa de Preço</th>
                <th className="py-3 px-4 text-center">Preço Sugerido</th>
                <th className="py-3 px-4 text-center">Tempo Médio</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-gray-900">{item.nome}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                      {item.categoria}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">
                    {formatMoney(item.valorMin)} - {formatMoney(item.valorMax)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                      {formatMoney(item.valorSugerido)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-500 font-medium">
                    {item.tempoEstimadoHoras ? `${item.tempoEstimadoHoras}h` : "1h"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDeleteServico(item.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Novo Móvel / Serviço</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Nome do Móvel / Serviço *
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Guarda-roupa 5 portas com espelho"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Categoria
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                >
                  <option value="Quarto">Quarto</option>
                  <option value="Cozinha">Cozinha</option>
                  <option value="Sala">Sala</option>
                  <option value="Escritório">Escritório</option>
                  <option value="Desmontagem">Desmontagem</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Preço Mínimo (R$)
                  </label>
                  <input
                    type="number"
                    value={valorMin}
                    onChange={(e) => setValorMin(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Preço Máximo (R$)
                  </label>
                  <input
                    type="number"
                    value={valorMax}
                    onChange={(e) => setValorMax(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Preço Sugerido (R$) *
                  </label>
                  <input
                    type="number"
                    required
                    value={valorSugerido}
                    onChange={(e) => setValorSugerido(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-emerald-300 rounded-xl text-sm font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Tempo Médio (h)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={tempoEstimado}
                    onChange={(e) => setTempoEstimado(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
