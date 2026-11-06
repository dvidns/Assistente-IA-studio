import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Wrench,
  BarChart3,
  Settings,
  Plus,
  Hammer,
  Menu,
  X,
  PhoneCall,
} from "lucide-react";
import {
  Cliente,
  Agendamento,
  Servico,
  Orcamento,
  AppSettings,
  StatusAgendamento,
  StatusOrcamento,
} from "./types";
import {
  getClientes,
  saveClientes,
  addCliente,
  updateCliente,
  deleteCliente,
  getAgendamentos,
  saveAgendamentos,
  addAgendamento,
  updateAgendamento,
  deleteAgendamento,
  getServicos,
  saveServicos,
  addServico,
  updateServico,
  deleteServico,
  getOrcamentos,
  saveOrcamentos,
  addOrcamento,
  updateOrcamento,
  deleteOrcamento,
  getSettings,
  saveSettings,
} from "./lib/storage";

import { TodayView } from "./views/TodayView";
import { AgendaView } from "./views/AgendaView";
import { ClientesView } from "./views/ClientesView";
import { OrcamentosView } from "./views/OrcamentosView";
import { ServicosView } from "./views/ServicosView";
import { RelatoriosView } from "./views/RelatoriosView";
import { ConfiguracoesView } from "./views/ConfiguracoesView";

import { AppointmentModal } from "./components/AppointmentModal";
import { ClientModal } from "./components/ClientModal";
import { QuoteModal } from "./components/QuoteModal";

export function App() {
  const [activeTab, setActiveTab] = useState<
    "hoje" | "agenda" | "clientes" | "orcamentos" | "servicos" | "relatorios" | "configuracoes"
  >("hoje");

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [settings, setSettings] = useState<AppSettings>(getSettings());

  // Modals state
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Agendamento | null>(null);

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Orcamento | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load data
  const loadData = useCallback(() => {
    setClientes(getClientes());
    setAgendamentos(getAgendamentos());
    setServicos(getServicos());
    setOrcamentos(getOrcamentos());
    setSettings(getSettings());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Appointment Handlers
  const handleSaveAppointment = (data: Omit<Agendamento, "id" | "criadoEm">) => {
    if (editingAppointment) {
      updateAgendamento(editingAppointment.id, data);
    } else {
      addAgendamento(data);
    }
    loadData();
    setIsAppModalOpen(false);
    setEditingAppointment(null);
  };

  const handleEditAppointment = (a: Agendamento) => {
    setEditingAppointment(a);
    setIsAppModalOpen(true);
  };

  const handleDeleteAppointment = (id: string) => {
    if (confirm("Deseja realmente excluir este agendamento?")) {
      deleteAgendamento(id);
      loadData();
    }
  };

  const handleStatusChange = (id: string, newStatus: StatusAgendamento) => {
    updateAgendamento(id, { status: newStatus });
    loadData();
  };

  // Client Handlers
  const handleSaveClient = (data: Omit<Cliente, "id" | "criadoEm">) => {
    if (editingClient) {
      updateCliente(editingClient.id, data);
    } else {
      addCliente(data);
    }
    loadData();
    setIsClientModalOpen(false);
    setEditingClient(null);
  };

  const handleQuickAddClient = (data: Omit<Cliente, "id" | "criadoEm">): Cliente => {
    const created = addCliente(data);
    loadData();
    return created;
  };

  const handleEditClient = (c: Cliente) => {
    setEditingClient(c);
    setIsClientModalOpen(true);
  };

  const handleDeleteClient = (id: string) => {
    if (confirm("Deseja realmente excluir este cliente? Seus agendamentos continuarão salvos.")) {
      deleteCliente(id);
      loadData();
    }
  };

  const handleNewAppointmentWithClient = (c: Cliente) => {
    setEditingAppointment(null);
    setIsAppModalOpen(true);
  };

  // Quote Handlers
  const handleSaveQuote = (data: Omit<Orcamento, "id" | "criadoEm">) => {
    if (editingQuote) {
      updateOrcamento(editingQuote.id, data);
    } else {
      addOrcamento(data);
    }
    loadData();
    setIsQuoteModalOpen(false);
    setEditingQuote(null);
  };

  const handleEditQuote = (o: Orcamento) => {
    setEditingQuote(o);
    setIsQuoteModalOpen(true);
  };

  const handleDeleteQuote = (id: string) => {
    if (confirm("Deseja realmente excluir este orçamento?")) {
      deleteOrcamento(id);
      loadData();
    }
  };

  const handleQuoteStatusChange = (id: string, status: StatusOrcamento) => {
    updateOrcamento(id, { status });
    loadData();
  };

  const handleConvertToAppointment = (o: Orcamento) => {
    // Open appointment modal prefilled with quote's items and client
    const today = new Date().toISOString().slice(0, 10);
    const convertedItems = o.itens.map((i) => ({
      id: "item_" + Math.random().toString(36).substring(2, 7),
      servicoNome: i.servicoNome,
      valor: i.valor,
      quantidade: i.quantidade,
    }));

    const prefilled: Agendamento = {
      id: "",
      clienteId: o.clienteId,
      clienteNome: o.clienteNome,
      clienteTelefone: o.clienteTelefone,
      data: today,
      hora: "09:00",
      tipoServico: o.itens.map((i) => (i.quantidade > 1 ? `${i.servicoNome} (x${i.quantidade})` : i.servicoNome)).join(" + "),
      valor: o.total,
      status: "confirmado",
      moveis: convertedItems,
      descricao: o.observacoes || "Gerado a partir de orçamento aprovado.",
      criadoEm: new Date().toISOString(),
    };

    updateOrcamento(o.id, { status: "aprovado" });
    setEditingAppointment(prefilled);
    setIsAppModalOpen(true);
  };

  // Service Handlers
  const handleAddServico = (s: Omit<Servico, "id">) => {
    addServico(s);
    loadData();
  };

  const handleUpdateServico = (id: string, s: Partial<Servico>) => {
    updateServico(id, s);
    loadData();
  };

  const handleDeleteServico = (id: string) => {
    if (confirm("Deseja realmente excluir este serviço da tabela?")) {
      deleteServico(id);
      loadData();
    }
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    saveSettings(newSettings);
    setSettings(newSettings);
  };

  const navItems = [
    { key: "hoje", label: "Hoje", icon: Clock },
    { key: "agenda", label: "Agenda", icon: Calendar },
    { key: "clientes", label: "Clientes", icon: Users },
    { key: "orcamentos", label: "Orçamentos", icon: FileText },
    { key: "servicos", label: "Preços & Cálculos", icon: Wrench },
    { key: "relatorios", label: "Relatórios", icon: BarChart3 },
    { key: "configuracoes", label: "Ajustes", icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#202124] flex flex-col font-sans">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200/90 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <Hammer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-gray-900 block leading-none">
                  Monta<span className="text-blue-600">Fácil</span>
                </span>
                <span className="text-[10px] font-semibold text-gray-500 tracking-wide uppercase">
                  Gestão para Montadores
                </span>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-xs"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Action button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingAppointment(null);
                  setIsAppModalOpen(true);
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Agendamento</span>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => {
                setEditingAppointment(null);
                setIsAppModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              + Novo Agendamento
            </button>
          </div>
        )}
      </header>

      {/* Main Content View Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-12">
        {activeTab === "hoje" && (
          <TodayView
            agendamentos={agendamentos}
            onAddClick={() => {
              setEditingAppointment(null);
              setIsAppModalOpen(true);
            }}
            onEditClick={handleEditAppointment}
            onDeleteClick={handleDeleteAppointment}
            onStatusChange={handleStatusChange}
            settings={settings}
          />
        )}

        {activeTab === "agenda" && (
          <AgendaView
            agendamentos={agendamentos}
            onAddClick={() => {
              setEditingAppointment(null);
              setIsAppModalOpen(true);
            }}
            onEditClick={handleEditAppointment}
            onDeleteClick={handleDeleteAppointment}
            onStatusChange={handleStatusChange}
            settings={settings}
          />
        )}

        {activeTab === "clientes" && (
          <ClientesView
            clientes={clientes}
            agendamentos={agendamentos}
            onAddClick={() => {
              setEditingClient(null);
              setIsClientModalOpen(true);
            }}
            onEditClick={handleEditClient}
            onDeleteClick={handleDeleteClient}
            onNewAppointmentWithClient={handleNewAppointmentWithClient}
          />
        )}

        {activeTab === "orcamentos" && (
          <OrcamentosView
            orcamentos={orcamentos}
            onAddClick={() => {
              setEditingQuote(null);
              setIsQuoteModalOpen(true);
            }}
            onEditClick={handleEditQuote}
            onDeleteClick={handleDeleteQuote}
            onStatusChange={handleQuoteStatusChange}
            onConvertToAppointment={handleConvertToAppointment}
          />
        )}

        {activeTab === "servicos" && (
          <ServicosView
            servicos={servicos}
            onAddServico={handleAddServico}
            onUpdateServico={handleUpdateServico}
            onDeleteServico={handleDeleteServico}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {activeTab === "relatorios" && <RelatoriosView agendamentos={agendamentos} />}

        {activeTab === "configuracoes" && (
          <ConfiguracoesView
            settings={settings}
            onSaveSettings={handleUpdateSettings}
            onDataReload={loadData}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 py-1.5 px-2 flex justify-around items-center shadow-lg">
        {[
          { key: "hoje", label: "Hoje", icon: Clock },
          { key: "agenda", label: "Agenda", icon: Calendar },
          { key: "clientes", label: "Clientes", icon: Users },
          { key: "orcamentos", label: "Orçamentos", icon: FileText },
          { key: "relatorios", label: "Relatórios", icon: BarChart3 },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as any)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
                isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Modals */}
      {isAppModalOpen && (
        <AppointmentModal
          isOpen={isAppModalOpen}
          onClose={() => {
            setIsAppModalOpen(false);
            setEditingAppointment(null);
          }}
          onSave={handleSaveAppointment}
          clientes={clientes}
          servicos={servicos}
          editingAppointment={editingAppointment}
          onQuickAddClient={handleQuickAddClient}
        />
      )}

      {isClientModalOpen && (
        <ClientModal
          isOpen={isClientModalOpen}
          onClose={() => {
            setIsClientModalOpen(false);
            setEditingClient(null);
          }}
          onSave={handleSaveClient}
          editingClient={editingClient}
        />
      )}

      {isQuoteModalOpen && (
        <QuoteModal
          isOpen={isQuoteModalOpen}
          onClose={() => {
            setIsQuoteModalOpen(false);
            setEditingQuote(null);
          }}
          onSave={handleSaveQuote}
          clientes={clientes}
          servicos={servicos}
          editingQuote={editingQuote}
        />
      )}
    </div>
  );
}
export default App;
