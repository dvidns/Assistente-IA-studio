import { Cliente, Agendamento, Servico, Orcamento, AppSettings } from "../types";

export const SERVICOS_PADRAO: Servico[] = [
  { id: "s1", nome: "Guarda-roupa 2 portas", categoria: "Quarto", valorMin: 80, valorMax: 150, valorSugerido: 100, tempoEstimadoHoras: 1.5 },
  { id: "s2", nome: "Guarda-roupa 3 portas", categoria: "Quarto", valorMin: 100, valorMax: 180, valorSugerido: 130, tempoEstimadoHoras: 2 },
  { id: "s3", nome: "Guarda-roupa 4 portas", categoria: "Quarto", valorMin: 120, valorMax: 220, valorSugerido: 160, tempoEstimadoHoras: 2.5 },
  { id: "s4", nome: "Guarda-roupa 6 portas", categoria: "Quarto", valorMin: 150, valorMax: 280, valorSugerido: 200, tempoEstimadoHoras: 3.5 },
  { id: "s5", nome: "Cama de solteiro", categoria: "Quarto", valorMin: 60, valorMax: 100, valorSugerido: 80, tempoEstimadoHoras: 1 },
  { id: "s6", nome: "Cama de casal", categoria: "Quarto", valorMin: 80, valorMax: 130, valorSugerido: 100, tempoEstimadoHoras: 1.5 },
  { id: "s7", nome: "Cama box", categoria: "Quarto", valorMin: 50, valorMax: 90, valorSugerido: 70, tempoEstimadoHoras: 0.8 },
  { id: "s8", nome: "Cômoda", categoria: "Quarto", valorMin: 60, valorMax: 100, valorSugerido: 80, tempoEstimadoHoras: 1.2 },
  { id: "s9", nome: "Armário de cozinha (por módulo)", categoria: "Cozinha", valorMin: 40, valorMax: 80, valorSugerido: 60, tempoEstimadoHoras: 1 },
  { id: "s10", nome: "Cozinha completa (até 10 módulos)", categoria: "Cozinha", valorMin: 300, valorMax: 600, valorSugerido: 400, tempoEstimadoHoras: 6 },
  { id: "s11", nome: "Mesa de jantar", categoria: "Sala", valorMin: 60, valorMax: 120, valorSugerido: 80, tempoEstimadoHoras: 1 },
  { id: "s12", nome: "Estante/Rack TV", categoria: "Sala", valorMin: 80, valorMax: 150, valorSugerido: 100, tempoEstimadoHoras: 1.5 },
  { id: "s13", nome: "Painel de TV com suporte", categoria: "Sala", valorMin: 80, valorMax: 160, valorSugerido: 120, tempoEstimadoHoras: 1.5 },
  { id: "s14", nome: "Mesa de escritório", categoria: "Escritório", valorMin: 60, valorMax: 120, valorSugerido: 80, tempoEstimadoHoras: 1 },
  { id: "s15", nome: "Cadeira de escritório", categoria: "Escritório", valorMin: 30, valorMax: 60, valorSugerido: 40, tempoEstimadoHoras: 0.5 },
  { id: "s16", nome: "Estante de livros", categoria: "Escritório", valorMin: 60, valorMax: 120, valorSugerido: 80, tempoEstimadoHoras: 1.2 },
  { id: "s17", nome: "Desmontagem de móvel", categoria: "Desmontagem", valorMin: 40, valorMax: 90, valorSugerido: 60, tempoEstimadoHoras: 1 },
  { id: "s18", nome: "Berço infantil", categoria: "Quarto", valorMin: 60, valorMax: 100, valorSugerido: 80, tempoEstimadoHoras: 1.2 },
  { id: "s19", nome: "Beliche", categoria: "Quarto", valorMin: 100, valorMax: 160, valorSugerido: 130, tempoEstimadoHoras: 2 },
  { id: "s20", nome: "Armário de banheiro/lavanderia", categoria: "Outros", valorMin: 50, valorMax: 90, valorSugerido: 70, tempoEstimadoHoras: 1 },
];

const STORAGE_KEYS = {
  CLIENTES: "montafacil_clientes",
  AGENDAMENTOS: "montafacil_agendamentos",
  SERVICOS: "montafacil_servicos",
  ORCAMENTOS: "montafacil_orcamentos",
  SETTINGS: "montafacil_settings",
};

export const DEFAULT_SETTINGS: AppSettings = {
  whatsappTipo: "web",
  avaliacaoLink: "https://g.page/r/review",
  valorHora: 100,
  lembretePersonalizado: "Olá {cliente}! Confirmando seu agendamento de montagem de {servico} para o dia {data} às {hora}. Endereço: {endereco}. Valor: {valor}. Qualquer dúvida estou à disposição!",
};

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getFutureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const SEED_CLIENTES: Cliente[] = [
  {
    id: "c1",
    nome: "Mariana Silva",
    telefone: "11987654321",
    endereco: "Rua das Flores, 142 - Apto 32",
    bairro: "Jardins",
    notas: "Cliente preferiu horário pela manhã. Porteiro avisado.",
    criadoEm: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "c2",
    nome: "Carlos Eduardo Costa",
    telefone: "11971234567",
    endereco: "Av. Paulista, 1000 - Apto 101",
    bairro: "Bela Vista",
    notas: "Montagem de guarda-roupa casal grande e estante.",
    criadoEm: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "c3",
    nome: "Patricia Mendes",
    telefone: "11993456789",
    endereco: "Rua Harmonia, 520",
    bairro: "Vila Madalena",
    notas: "Cozinha planejada modulada. Precisa de retorno para puxadores.",
    criadoEm: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "c4",
    nome: "Roberto Almeida",
    telefone: "11984561234",
    endereco: "Rua Vergueiro, 2400",
    bairro: "Vila Mariana",
    notas: "Rack e painel de TV.",
    criadoEm: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const SEED_AGENDAMENTOS: Agendamento[] = [
  {
    id: "ag1",
    clienteId: "c1",
    clienteNome: "Mariana Silva",
    clienteTelefone: "11987654321",
    data: getTodayString(),
    hora: "09:00",
    tipoServico: "Guarda-roupa 4 portas + Cama box",
    descricao: "Móvel novo entregue pela loja ontem. Embalagens intactas.",
    endereco: "Rua das Flores, 142 - Apto 32, Jardins",
    valor: 230,
    status: "confirmado",
    moveis: [
      { id: "m1", servicoNome: "Guarda-roupa 4 portas", valor: 160, quantidade: 1 },
      { id: "m2", servicoNome: "Cama box", valor: 70, quantidade: 1 },
    ],
    criadoEm: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "ag2",
    clienteId: "c2",
    clienteNome: "Carlos Eduardo Costa",
    clienteTelefone: "11971234567",
    data: getTodayString(),
    hora: "14:30",
    tipoServico: "Estante/Rack TV",
    descricao: "Montagem e fixação do painel na parede de drywall com buchas especiais.",
    endereco: "Av. Paulista, 1000 - Apto 101, Bela Vista",
    valor: 140,
    status: "pendente",
    moveis: [
      { id: "m3", servicoNome: "Estante/Rack TV", valor: 100, quantidade: 1 },
      { id: "m4", servicoNome: "Painel de TV com suporte", valor: 40, quantidade: 1 },
    ],
    criadoEm: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "ag3",
    clienteId: "c3",
    clienteNome: "Patricia Mendes",
    clienteTelefone: "11993456789",
    data: getFutureDate(1),
    hora: "10:00",
    tipoServico: "Cozinha completa (até 10 módulos)",
    descricao: "Cozinha modulada completa com balcão de pia e aéreos.",
    endereco: "Rua Harmonia, 520, Vila Madalena",
    valor: 450,
    status: "confirmado",
    temRetorno: true,
    dataRetorno: getFutureDate(3),
    horaRetorno: "15:00",
    motivoRetorno: "Faltaram 2 puxadores que a loja vai entregar depois de amanhã",
    moveis: [
      { id: "m5", servicoNome: "Cozinha completa (até 10 módulos)", valor: 450, quantidade: 1 },
    ],
    criadoEm: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "ag4",
    clienteId: "c4",
    clienteNome: "Roberto Almeida",
    clienteTelefone: "11984561234",
    data: getFutureDate(2),
    hora: "11:00",
    tipoServico: "Mesa de escritório + Cadeira",
    descricao: "Montagem home office.",
    endereco: "Rua Vergueiro, 2400, Vila Mariana",
    valor: 120,
    status: "pendente",
    moveis: [
      { id: "m6", servicoNome: "Mesa de escritório", valor: 80, quantidade: 1 },
      { id: "m7", servicoNome: "Cadeira de escritório", valor: 40, quantidade: 1 },
    ],
    criadoEm: new Date().toISOString(),
  },
];

const SEED_ORCAMENTOS: Orcamento[] = [
  {
    id: "orc1",
    clienteId: "c1",
    clienteNome: "Mariana Silva",
    clienteTelefone: "11987654321",
    itens: [
      { servicoId: "s3", servicoNome: "Guarda-roupa 4 portas", quantidade: 1, valor: 160 },
      { servicoId: "s7", servicoNome: "Cama box", quantidade: 1, valor: 70 },
    ],
    total: 230,
    status: "aprovado",
    observacoes: "Pagamento via Pix na conclusão do serviço.",
    criadoEm: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "orc2",
    clienteId: "c3",
    clienteNome: "Patricia Mendes",
    clienteTelefone: "11993456789",
    itens: [
      { servicoId: "s10", servicoNome: "Cozinha completa (até 10 módulos)", quantidade: 1, valor: 400 },
      { servicoId: "s17", servicoNome: "Desmontagem de móvel", quantidade: 1, valor: 60 },
    ],
    total: 460,
    status: "pendente",
    observacoes: "Inclui desmontagem do armário antigo da cozinha.",
    criadoEm: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

// In-memory fallback if localStorage is disabled or running in certain environments
const memStore: Record<string, string> = {};

function safeGet(key: string): string | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return memStore[key] || null;
  } catch {
    return memStore[key] || null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
    memStore[key] = value;
  } catch {
    memStore[key] = value;
  }
}

export function generateId(): string {
  return "id_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// ─── Clientes ─────────────────────────────────────────────────────────────────
export function getClientes(): Cliente[] {
  const raw = safeGet(STORAGE_KEYS.CLIENTES);
  if (!raw) {
    saveClientes(SEED_CLIENTES);
    return SEED_CLIENTES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return SEED_CLIENTES;
  }
}

export function saveClientes(clientes: Cliente[]): void {
  safeSet(STORAGE_KEYS.CLIENTES, JSON.stringify(clientes));
}

export function addCliente(data: Omit<Cliente, "id" | "criadoEm">): Cliente {
  const clientes = getClientes();
  const novo: Cliente = {
    ...data,
    id: generateId(),
    criadoEm: new Date().toISOString(),
  };
  saveClientes([novo, ...clientes]);
  return novo;
}

export function updateCliente(id: string, data: Partial<Cliente>): void {
  const clientes = getClientes();
  const updated = clientes.map((c) => (c.id === id ? { ...c, ...data } : c));
  saveClientes(updated);
}

export function deleteCliente(id: string): void {
  const clientes = getClientes();
  saveClientes(clientes.filter((c) => c.id !== id));
}

// ─── Agendamentos ─────────────────────────────────────────────────────────────
export function getAgendamentos(): Agendamento[] {
  const raw = safeGet(STORAGE_KEYS.AGENDAMENTOS);
  if (!raw) {
    saveAgendamentos(SEED_AGENDAMENTOS);
    return SEED_AGENDAMENTOS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return SEED_AGENDAMENTOS;
  }
}

export function saveAgendamentos(agendamentos: Agendamento[]): void {
  safeSet(STORAGE_KEYS.AGENDAMENTOS, JSON.stringify(agendamentos));
}

export function addAgendamento(data: Omit<Agendamento, "id" | "criadoEm">): Agendamento {
  const list = getAgendamentos();
  const novo: Agendamento = {
    ...data,
    id: generateId(),
    criadoEm: new Date().toISOString(),
  };
  saveAgendamentos([novo, ...list]);
  return novo;
}

export function updateAgendamento(id: string, data: Partial<Agendamento>): void {
  const list = getAgendamentos();
  const updated = list.map((a) => (a.id === id ? { ...a, ...data, atualizadoEm: new Date().toISOString() } : a));
  saveAgendamentos(updated);
}

export function deleteAgendamento(id: string): void {
  const list = getAgendamentos();
  saveAgendamentos(list.filter((a) => a.id !== id));
}

// ─── Serviços ─────────────────────────────────────────────────────────────────
export function getServicos(): Servico[] {
  const raw = safeGet(STORAGE_KEYS.SERVICOS);
  if (!raw) {
    saveServicos(SERVICOS_PADRAO);
    return SERVICOS_PADRAO;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return SERVICOS_PADRAO;
  }
}

export function saveServicos(servicos: Servico[]): void {
  safeSet(STORAGE_KEYS.SERVICOS, JSON.stringify(servicos));
}

export function addServico(data: Omit<Servico, "id">): Servico {
  const list = getServicos();
  const novo: Servico = {
    ...data,
    id: generateId(),
  };
  saveServicos([...list, novo]);
  return novo;
}

export function updateServico(id: string, data: Partial<Servico>): void {
  const list = getServicos();
  saveServicos(list.map((s) => (s.id === id ? { ...s, ...data } : s)));
}

export function deleteServico(id: string): void {
  const list = getServicos();
  saveServicos(list.filter((s) => s.id !== id));
}

// ─── Orçamentos ───────────────────────────────────────────────────────────────
export function getOrcamentos(): Orcamento[] {
  const raw = safeGet(STORAGE_KEYS.ORCAMENTOS);
  if (!raw) {
    saveOrcamentos(SEED_ORCAMENTOS);
    return SEED_ORCAMENTOS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return SEED_ORCAMENTOS;
  }
}

export function saveOrcamentos(orcamentos: Orcamento[]): void {
  safeSet(STORAGE_KEYS.ORCAMENTOS, JSON.stringify(orcamentos));
}

export function addOrcamento(data: Omit<Orcamento, "id" | "criadoEm">): Orcamento {
  const list = getOrcamentos();
  const novo: Orcamento = {
    ...data,
    id: generateId(),
    criadoEm: new Date().toISOString(),
  };
  saveOrcamentos([novo, ...list]);
  return novo;
}

export function updateOrcamento(id: string, data: Partial<Orcamento>): void {
  const list = getOrcamentos();
  saveOrcamentos(list.map((o) => (o.id === id ? { ...o, ...data } : o)));
}

export function deleteOrcamento(id: string): void {
  const list = getOrcamentos();
  saveOrcamentos(list.filter((o) => o.id !== id));
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export function getSettings(): AppSettings {
  const raw = safeGet(STORAGE_KEYS.SETTINGS);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  safeSet(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// ─── Backup & Restore ─────────────────────────────────────────────────────────
export function exportBackupData(): string {
  const data = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    clientes: getClientes(),
    agendamentos: getAgendamentos(),
    servicos: getServicos(),
    orcamentos: getOrcamentos(),
    settings: getSettings(),
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupData(jsonString: string): { success: boolean; error?: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!data.clientes || !data.agendamentos) {
      return { success: false, error: "Arquivo de backup inválido: formato incompatível." };
    }
    if (Array.isArray(data.clientes)) saveClientes(data.clientes);
    if (Array.isArray(data.agendamentos)) saveAgendamentos(data.agendamentos);
    if (Array.isArray(data.servicos)) saveServicos(data.servicos);
    if (Array.isArray(data.orcamentos)) saveOrcamentos(data.orcamentos);
    if (data.settings) saveSettings(data.settings);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Erro ao processar arquivo JSON." };
  }
}

export function resetToSeedData(): void {
  saveClientes(SEED_CLIENTES);
  saveAgendamentos(SEED_AGENDAMENTOS);
  saveServicos(SERVICOS_PADRAO);
  saveOrcamentos(SEED_ORCAMENTOS);
  saveSettings(DEFAULT_SETTINGS);
}
