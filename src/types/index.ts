export type StatusAgendamento = "pendente" | "confirmado" | "concluido" | "cancelado" | "retorno";
export type StatusOrcamento = "pendente" | "aprovado" | "recusado";

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  endereco?: string;
  bairro?: string;
  notas?: string;
  criadoEm: string;
}

export interface ItemServicoAgendamento {
  id: string;
  servicoNome: string;
  valor: number;
  quantidade: number;
}

export interface Agendamento {
  id: string;
  clienteId: string;
  clienteNome: string;
  clienteTelefone: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:MM
  tipoServico: string;
  descricao?: string;
  endereco?: string;
  valor: number;
  status: StatusAgendamento;
  moveis?: ItemServicoAgendamento[];
  temRetorno?: boolean;
  dataRetorno?: string;
  horaRetorno?: string;
  enderecoRetorno?: string;
  motivoRetorno?: string;
  valorRecebido?: number;
  dataConclusao?: string;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface Servico {
  id: string;
  nome: string;
  categoria: string;
  valorMin: number;
  valorMax: number;
  valorSugerido: number;
  tempoEstimadoHoras?: number;
}

export interface ItemOrcamento {
  servicoId: string;
  servicoNome: string;
  quantidade: number;
  valor: number;
  modulos?: number;
  valorPorModulo?: number;
}

export interface Orcamento {
  id: string;
  clienteId: string;
  clienteNome: string;
  clienteTelefone: string;
  itens: ItemOrcamento[];
  total: number;
  status: StatusOrcamento;
  observacoes?: string;
  criadoEm: string;
}

export interface AppSettings {
  whatsappTipo: "web" | "app";
  avaliacaoLink: string;
  valorHora: number;
  lembretePersonalizado: string;
}
