import { Company, User, Client, Quote, Contract, FinancialTransaction, ProductItem, CalendarEvent, AuditLog } from '../types';

export const INITIAL_COMPANY: Company = {
  id: 'comp_01',
  name: 'Serviços & Soluções Pro',
  nif: '509.823.112',
  email: 'contato@prosolucoes.com',
  phone: '+351 912 345 678',
  address: 'Av. da Liberdade, 245, 3º Andar',
  city: 'Lisboa',
  country: 'Portugal',
  currency: 'EUR',
  plan: 'pro',
};

export const INITIAL_COMPANIES: Company[] = [
  INITIAL_COMPANY,
  {
    id: 'comp_02',
    name: 'Oficina Mecânica Precision',
    nif: '241.998.401',
    email: 'atendimento@precisionauto.pt',
    phone: '+351 925 112 233',
    address: 'Rua do Ouro, 88',
    city: 'Porto',
    country: 'Portugal',
    currency: 'EUR',
    plan: 'business',
  },
  {
    id: 'comp_03',
    name: 'Consultoria Financeira Alfa',
    nif: '334.120.908',
    email: 'contato@alfaconsult.com',
    phone: '+55 11 98877-6655',
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    country: 'Brasil',
    currency: 'BRL',
    plan: 'enterprise',
  },
];

export const INITIAL_USER: User = {
  id: 'usr_01',
  name: 'Carlos Mendes',
  email: 'carlos@prosolucoes.com',
  role: 'admin',
  companyId: 'comp_01',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli_1',
    companyId: 'comp_01',
    name: 'João Silva',
    email: 'joao.silva@techcorp.pt',
    phone: '+351 919 887 766',
    nif: '234567890',
    companyName: 'TechCorp Europa',
    address: 'Rua Castilho 42, Lisboa',
    city: 'Lisboa',
    tags: ['VIP', 'Manutenção', 'Recorrente'],
    stage: 'negociacao',
    dealValue: 1250.00,
    notes: 'Solicitou orçamento para atualização de servidores de rede.',
    createdAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-07-20T14:30:00Z',
    locationUrl: 'https://maps.google.com/?q=Lisboa',
    documents: [
      { id: 'doc_1', name: 'Requisitos_Infra.pdf', url: '#', date: '2026-07-02' }
    ]
  },
  {
    id: 'cli_2',
    companyId: 'comp_01',
    name: 'Maria Santos',
    email: 'maria@clinicaestetica.pt',
    phone: '+351 933 221 100',
    nif: '298765432',
    companyName: 'Clínica Estética Santos',
    address: 'Rua Garrett 15, Lisboa',
    city: 'Lisboa',
    tags: ['Equipamentos', 'Urgente'],
    stage: 'proposta',
    dealValue: 2800.00,
    notes: 'Proposta enviada para instalação de ar condicionado central e conectividade.',
    createdAt: '2026-07-05T11:15:00Z',
    updatedAt: '2026-07-22T09:00:00Z',
  },
  {
    id: 'cli_3',
    companyId: 'comp_01',
    name: 'António Ferreira',
    email: 'a.ferreira@construtora.pt',
    phone: '+351 961 000 333',
    nif: '501234987',
    companyName: 'Ferreira Construções',
    address: 'Avenida Brasil 12, Cascais',
    city: 'Cascais',
    tags: ['Obras', 'Contrato Anual'],
    stage: 'fechado',
    dealValue: 5400.00,
    notes: 'Contrato fechado para consultoria de elétrica industrial.',
    createdAt: '2026-06-15T08:30:00Z',
    updatedAt: '2026-07-10T16:20:00Z',
  },
  {
    id: 'cli_4',
    companyId: 'comp_01',
    name: 'Sofia Oliveira',
    email: 'sofia@estudiodesign.com',
    phone: '+351 910 554 433',
    nif: '211223344',
    companyName: 'Estúdio Sofia Design',
    address: 'Rua Rosa 50, Lisboa',
    city: 'Lisboa',
    tags: ['Lead'],
    stage: 'lead',
    dealValue: 850.00,
    notes: 'Interessada em suporte técnico mensal.',
    createdAt: '2026-07-24T12:00:00Z',
    updatedAt: '2026-07-24T12:00:00Z',
  },
];

export const INITIAL_QUOTES: Quote[] = [
  {
    id: 'orc_1',
    number: 'ORC-2026-001',
    companyId: 'comp_01',
    clientId: 'cli_1',
    clientName: 'João Silva',
    clientEmail: 'joao.silva@techcorp.pt',
    clientPhone: '+351 919 887 766',
    clientNif: '234567890',
    date: '2026-07-20',
    dueDate: '2026-08-05',
    items: [
      { id: 'i1', description: 'Servidor Rack 1U Xeon OctaCore', quantity: 1, unitPrice: 850, taxPercent: 23, totalPrice: 850 },
      { id: 'i2', description: 'Instalação e Configuração de Firewall', quantity: 1, unitPrice: 400, taxPercent: 23, totalPrice: 400 }
    ],
    subtotal: 1250,
    taxTotal: 287.50,
    discount: 50,
    total: 1487.50,
    notes: 'Pagamento 50% na aprovação e 50% na conclusão da entrega.',
    terms: 'Validade do orçamento: 15 dias corridos.',
    warranty: 'Garantia de 12 meses nos equipamentos e 3 meses no serviço.',
    status: 'enviado',
    createdAt: '2026-07-20T14:30:00Z'
  },
  {
    id: 'orc_2',
    number: 'ORC-2026-002',
    companyId: 'comp_01',
    clientId: 'cli_2',
    clientName: 'Maria Santos',
    clientEmail: 'maria@clinicaestetica.pt',
    clientPhone: '+351 933 221 100',
    clientNif: '298765432',
    date: '2026-07-22',
    dueDate: '2026-08-10',
    items: [
      { id: 'i3', description: 'Sistema de Refrigeração Industrial Inverter', quantity: 2, unitPrice: 1200, taxPercent: 23, totalPrice: 2400 },
      { id: 'i4', description: 'Mão de obra especializada de instalação', quantity: 8, unitPrice: 50, taxPercent: 23, totalPrice: 400 }
    ],
    subtotal: 2800,
    taxTotal: 644,
    discount: 100,
    total: 3344,
    notes: 'Incluso certificado de garantia do fabricante.',
    terms: 'Pagamento via Transferência Bancária ou PIX.',
    warranty: 'Garantia de 24 meses.',
    status: 'aprovado',
    signatureUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50"><text x="10" y="30" font-family="cursive" font-size="20">Maria Santos</text></svg>',
    signedAt: '2026-07-23T11:00:00Z',
    createdAt: '2026-07-22T09:00:00Z'
  }
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'ctr_1',
    number: 'CTR-2026-012',
    companyId: 'comp_01',
    clientId: 'cli_3',
    clientName: 'António Ferreira (Ferreira Construções)',
    clientNif: '501234987',
    title: 'Prestação de Serviços de Manutenção Elétrica Industrial',
    type: 'manutencao',
    value: 5400.00,
    startDate: '2026-07-01',
    endDate: '2027-06-30',
    clauses: [
      'CLÁUSULA 1ª - O PRESTADOR compromete-se a fornecer suporte técnico preventivo e corretivo com atendimento em até 4 horas.',
      'CLÁUSULA 2ª - O valor contratual total é de €5.400,00, divididos em 12 parcelas mensais de €450,00.',
      'CLÁUSULA 3ª - O descumprimento dos prazos acarretará multa contratual de 2% ao mês sobre a parcela em atraso.',
      'CLÁUSULA 4ª - Foro da comarca de Lisboa para dirimir quaisquer litígios decorrentes deste instrumento.'
    ],
    status: 'ativo',
    signatureClient: 'António Ferreira',
    signedAtClient: '2026-07-02T15:00:00Z',
    createdAt: '2026-07-01T08:00:00Z'
  }
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'tr_1',
    companyId: 'comp_01',
    type: 'receita',
    description: 'Pagamento Orçamento ORC-2026-002 - Clínica Estética',
    category: 'Serviços',
    amount: 3344.00,
    date: '2026-07-23',
    dueDate: '2026-07-23',
    status: 'pago',
    clientId: 'cli_2',
    clientName: 'Maria Santos',
    costCenter: 'Comercial',
    paymentMethod: 'transferencia',
    createdAt: '2026-07-23T11:30:00Z'
  },
  {
    id: 'tr_2',
    companyId: 'comp_01',
    type: 'receita',
    description: 'Parcela 1/12 Contrato Manutenção - Ferreira Construções',
    category: 'Contratos Recorrentes',
    amount: 450.00,
    date: '2026-07-05',
    dueDate: '2026-07-05',
    status: 'pago',
    clientId: 'cli_3',
    clientName: 'António Ferreira',
    costCenter: 'Operacional',
    paymentMethod: 'pix',
    createdAt: '2026-07-05T09:00:00Z'
  },
  {
    id: 'tr_3',
    companyId: 'comp_01',
    type: 'despesa',
    description: 'Licença Software de Diagnóstico e Servidores',
    category: 'TI & Infraestrutura',
    amount: 290.00,
    date: '2026-07-15',
    dueDate: '2026-07-15',
    status: 'pago',
    costCenter: 'Tecnologia',
    paymentMethod: 'cartao',
    createdAt: '2026-07-15T14:00:00Z'
  },
  {
    id: 'tr_4',
    companyId: 'comp_01',
    type: 'despesa',
    description: 'Fornecedor de Cabos e Roteadores - Distribuidora',
    category: 'Fornecedores',
    amount: 820.00,
    date: '2026-07-10',
    dueDate: '2026-07-10',
    status: 'pago',
    costCenter: 'Estoque',
    paymentMethod: 'transferencia',
    createdAt: '2026-07-10T10:00:00Z'
  },
  {
    id: 'tr_5',
    companyId: 'comp_01',
    type: 'receita',
    description: 'Serviço pontual de rede - TechCorp',
    category: 'Serviços',
    amount: 850.00,
    date: '2026-07-12',
    dueDate: '2026-07-12',
    status: 'atrasado',
    clientId: 'cli_1',
    clientName: 'João Silva',
    costCenter: 'Comercial',
    paymentMethod: 'transferencia',
    createdAt: '2026-07-12T16:00:00Z'
  },
];

export const INITIAL_INVENTORY: ProductItem[] = [
  {
    id: 'prod_1',
    companyId: 'comp_01',
    sku: 'CAB-CAT6-100',
    barcode: '5601234567891',
    name: 'Cabo de Rede Cat6 100m Cobre',
    category: 'Cabeamento',
    price: 95.00,
    costPrice: 52.00,
    quantity: 4,
    minQuantity: 10, // Alerta de estoque baixo!
    supplier: 'Distribuidora Global Tech',
    unit: 'un',
    updatedAt: '2026-07-20T10:00:00Z'
  },
  {
    id: 'prod_2',
    companyId: 'comp_01',
    sku: 'ROT-GIGA-04',
    barcode: '5609876543210',
    name: 'Roteador Wi-Fi 6 Gigabit Dual Band',
    category: 'Equipamentos',
    price: 180.00,
    costPrice: 110.00,
    quantity: 12,
    minQuantity: 5,
    supplier: 'TechSupplier Lisboa',
    unit: 'un',
    updatedAt: '2026-07-21T12:00:00Z'
  },
  {
    id: 'prod_3',
    companyId: 'comp_01',
    sku: 'SRV-HOURS',
    name: 'Hora de Consultoria Técnica Especializada',
    category: 'Serviços',
    price: 65.00,
    costPrice: 20.00,
    quantity: 999,
    minQuantity: 0,
    unit: 'horas',
    updatedAt: '2026-07-01T00:00:00Z'
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt_1',
    companyId: 'comp_01',
    title: 'Visita técnica de verificação de rede',
    date: '2026-07-26',
    time: '14:30',
    durationMinutes: 60,
    clientName: 'João Silva (TechCorp)',
    clientId: 'cli_1',
    type: 'visita',
    completed: false,
    notes: 'Testar estabilidade do firewall e conectividade.'
  },
  {
    id: 'evt_2',
    companyId: 'comp_01',
    title: 'Apresentação da Proposta de Ar Condicionado',
    date: '2026-07-27',
    time: '10:00',
    durationMinutes: 45,
    clientName: 'Maria Santos',
    clientId: 'cli_2',
    type: 'reuniao',
    completed: false,
    notes: 'Alinhar prazos de instalação.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_1',
    companyId: 'comp_01',
    userName: 'Carlos Mendes',
    action: 'Criação de Orçamento',
    target: 'ORC-2026-002',
    details: 'Gerado orçamento no valor total de €3.344,00 para Maria Santos',
    timestamp: '2026-07-22T09:00:00Z',
    ip: '194.65.112.45'
  },
  {
    id: 'aud_2',
    companyId: 'comp_01',
    userName: 'Agente de IA Virtual',
    action: 'Execução Automática de Tarefa',
    target: 'Análise Financeira',
    details: 'IA identificou pagamento em atraso de €850 de João Silva e gerou sugestão de mensagem WhatsApp',
    timestamp: '2026-07-25T08:00:00Z',
    ip: '127.0.0.1 (IA System)'
  }
];

export const initialCompanies = INITIAL_COMPANIES;
export const initialClients = INITIAL_CLIENTS;
export const initialQuotes = INITIAL_QUOTES;
export const initialContracts = INITIAL_CONTRACTS;
export const initialTransactions = INITIAL_TRANSACTIONS;
export const initialInventory = INITIAL_INVENTORY;
export const initialCalendarEvents = INITIAL_CALENDAR_EVENTS;
export const initialAuditLogs = INITIAL_AUDIT_LOGS;

