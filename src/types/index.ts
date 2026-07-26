export type Language = 'pt' | 'en' | 'es' | 'fr';

export type UserRole = 'admin' | 'gerente' | 'financeiro' | 'comercial' | 'funcionario' | 'convidado';

export interface Company {
  id: string;
  name: string;
  nif: string; // NIF / CNPJ / Tax ID
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  logoUrl?: string;
  currency: string; // e.g. 'EUR' | 'BRL' | 'USD'
  plan: 'free' | 'pro' | 'business' | 'enterprise';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  companyId: string;
}

export type PipelineStage = 'lead' | 'negociacao' | 'proposta' | 'fechado' | 'perdido';

export interface Client {
  id: string;
  companyId: string;
  name: string;
  email: string;
  phone: string; // WhatsApp
  nif: string; // CPF / CNPJ / NIF
  companyName?: string;
  address?: string;
  city?: string;
  tags: string[];
  stage: PipelineStage;
  dealValue: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  locationUrl?: string;
  documents?: { id: string; name: string; url: string; date: string }[];
}


export type QuoteStatus = 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado' | 'convertido';

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  totalPrice: number;
}

export interface Quote {
  id: string;
  number: string; // e.g. ORC-2026-001
  companyId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientNif: string;
  date: string;
  dueDate: string;
  items: QuoteItem[];
  subtotal: number;
  taxTotal: number;
  discount: number;
  total: number;
  notes: string;
  terms: string;
  warranty: string;
  status: QuoteStatus;
  signatureUrl?: string;
  signedAt?: string;
  createdAt: string;
}

export type ContractType = 'prestacao_servico' | 'consultoria' | 'manutencao' | 'locacao' | 'desenvolvimento' | 'personalizado';

export type ContractStatus = 'ativo' | 'pendente_assinatura' | 'expirado' | 'cancelado';

export interface Contract {
  id: string;
  number: string; // e.g. CTR-2026-012
  companyId: string;
  clientId: string;
  clientName: string;
  clientNif: string;
  title: string;
  type: ContractType;
  value: number;
  startDate: string;
  endDate: string;
  clauses: string[];
  status: ContractStatus;
  signatureClient?: string;
  signedAtClient?: string;
  createdAt: string;
}

export type TransactionType = 'receita' | 'despesa';
export type TransactionStatus = 'pago' | 'pendente' | 'atrasado';

export interface FinancialTransaction {
  id: string;
  companyId: string;
  type: TransactionType;
  description: string;
  category: string; // e.g. 'Serviços', 'Fornecedores', 'Salários', 'Impostos', 'Aluguel'
  amount: number;
  date: string;
  dueDate: string;
  status: TransactionStatus;
  clientId?: string;
  clientName?: string;
  costCenter?: string; // Centro de Custo
  paymentMethod?: 'pix' | 'transferencia' | 'cartao' | 'boleto' | 'stripe';
  receiptUrl?: string;
  createdAt: string;
}

export interface ProductItem {
  id: string;
  companyId: string;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  type?: 'produto' | 'servico';
  category: string;
  price: number;
  cost?: number;
  costPrice?: number;
  quantity: number;
  minQuantity: number;
  supplier?: string;
  unit: string; // e.g. 'un', 'kg', 'horas', 'm'
  updatedAt?: string;
}

export interface CalendarEvent {
  id: string;
  companyId: string;
  title: string;
  date: string;
  time: string;
  durationMinutes: number;
  clientName?: string;
  clientId?: string;
  type: 'reuniao' | 'visita' | 'chamada' | 'servico' | 'lembrete';
  location?: string;
  completed: boolean;
  notes?: string;
}

export interface AuditLog {
  id: string;
  companyId: string;
  userName: string;
  action: string; // e.g. 'Criação de Orçamento', 'Exclusão de Cliente', 'Execução IA'
  target?: string;
  details?: string;
  module?: string;
  timestamp: string;
  ip?: string;
  ipAddress?: string;
}


export interface AIActionResult {
  action: 'CREATE_CLIENT' | 'CREATE_QUOTE' | 'GENERATE_CONTRACT' | 'RECORD_TRANSACTION' | 'SEND_WHATSAPP' | 'DAILY_SUMMARY' | 'GENERAL_QUERY' | 'EXPLAIN_DOCUMENT';
  message: string;
  dataCreated?: any;
  requiresConfirmation?: boolean;
  confirmationDetails?: {
    actionType: string;
    description: string;
    targetName: string;
  };
}

export interface DailyBriefing {
  date: string;
  revenueComparisonText: string;
  alerts: string[];
  opportunities: string[];
  riskAnalysis: string;
  summaryText: string;
}
