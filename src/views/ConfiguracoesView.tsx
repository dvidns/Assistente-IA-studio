import React, { useState } from "react";
import { Settings, Save, Download, Upload, RefreshCw, CheckCircle, AlertTriangle, MessageSquare, Star } from "lucide-react";
import { AppSettings } from "../types";
import { exportBackupData, importBackupData, resetToSeedData } from "../lib/storage";

interface ConfiguracoesViewProps {
  settings: AppSettings;
  onSaveSettings: (s: AppSettings) => void;
  onDataReload: () => void;
}

export function ConfiguracoesView({ settings, onSaveSettings, onDataReload }: ConfiguracoesViewProps) {
  const [form, setForm] = useState<AppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [backupMessage, setBackupMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportBackupData();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `montafacil_backup_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setBackupMessage({ text: "Backup exportado com sucesso!" });
    setTimeout(() => setBackupMessage(null), 4000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importBackupData(content);
      if (res.success) {
        setBackupMessage({ text: "Backup importado com sucesso! Seus dados foram restaurados." });
        onDataReload();
      } else {
        setBackupMessage({ text: res.error || "Erro ao importar backup.", error: true });
      }
      setTimeout(() => setBackupMessage(null), 5000);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleResetData = () => {
    if (confirm("Tem certeza que deseja restaurar os dados de demonstração iniciais? Isso substituirá seus dados atuais.")) {
      resetToSeedData();
      onDataReload();
      setBackupMessage({ text: "Dados de demonstração restaurados com sucesso!" });
      setTimeout(() => setBackupMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações & Backup</h1>
        <p className="text-xs text-gray-500">
          Personalize mensagens, valor da hora técnica e gerencie a segurança dos seus dados
        </p>
      </div>

      {backupMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
            backupMessage.error
              ? "bg-red-50 text-red-800 border border-red-200"
              : "bg-emerald-50 text-emerald-800 border border-emerald-200"
          }`}
        >
          {backupMessage.error ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
          <span>{backupMessage.text}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 pb-3 border-b border-gray-100">
          <Settings className="w-4 h-4 text-blue-600" />
          Parâmetros do Profissional
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Valor da Hora Técnica Padrão (R$)
            </label>
            <input
              type="number"
              min="20"
              step="5"
              value={form.valorHora}
              onChange={(e) => setForm({ ...form, valorHora: Number(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-blue-700 focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-gray-400 mt-1">Usado como base na calculadora de montagem.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Link de Avaliação Google Meu Negócio
            </label>
            <div className="relative">
              <Star className="w-4 h-4 text-amber-500 absolute left-3 top-3.5" />
              <input
                type="url"
                value={form.avaliacaoLink}
                onChange={(e) => setForm({ ...form, avaliacaoLink: e.target.value })}
                placeholder="https://g.page/r/sua-empresa/review"
                className="w-full pl-9 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Link enviado ao cliente após conclusão do serviço.</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            Modelo de Mensagem de Lembrete (WhatsApp)
          </label>
          <textarea
            rows={4}
            value={form.lembretePersonalizado}
            onChange={(e) => setForm({ ...form, lembretePersonalizado: e.target.value })}
            className="w-full p-3.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 text-gray-800 font-sans"
          />
          <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] text-gray-500">
            <span>Variáveis automáticas:</span>
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">{"{cliente}"}</code>
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">{"{servico}"}</code>
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">{"{data}"}</code>
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">{"{hora}"}</code>
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">{"{endereco}"}</code>
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">{"{valor}"}</code>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Configurações salvas!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>
      </form>

      {/* Backup and Restore Box */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-sm pb-3 border-b border-gray-100 flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-600" />
          Backup e Segurança dos Dados
        </h3>
        <p className="text-xs text-gray-500">
          Você pode salvar uma cópia completa dos seus clientes, serviços, agendamentos e orçamentos em seu computador ou celular, e restaurá-la a qualquer momento.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-center group"
          >
            <Download className="w-5 h-5 text-blue-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-gray-800">Exportar Backup</span>
            <span className="text-[10px] text-gray-400 mt-0.5">Baixar arquivo JSON</span>
          </button>

          <label className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-center cursor-pointer group">
            <Upload className="w-5 h-5 text-emerald-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-gray-800">Restaurar Backup</span>
            <span className="text-[10px] text-gray-400 mt-0.5">Importar arquivo JSON</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>

          <button
            type="button"
            onClick={handleResetData}
            className="flex flex-col items-center justify-center p-4 border border-red-100 rounded-xl hover:bg-red-50/60 transition-all text-center group"
          >
            <RefreshCw className="w-5 h-5 text-red-500 mb-1.5 group-hover:rotate-180 transition-transform" />
            <span className="text-xs font-bold text-red-700">Restaurar Exemplo</span>
            <span className="text-[10px] text-red-400 mt-0.5">Recarregar dados demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
