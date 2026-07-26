import React, { useState, useEffect } from 'react';
import {
  Company, Client, Quote, Contract, FinancialTransaction,
  ProductItem, CalendarEvent, AuditLog, Language, PipelineStage
} from './types';
import { initialCompanies, initialClients, initialQuotes, initialContracts, initialTransactions, initialInventory, initialCalendarEvents, initialAuditLogs } from './data/initialData';
import { getStoredData, setStoredData } from './lib/storage';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AIAgentDrawer } from './components/ai/AIAgentDrawer';

// Module Views
import { DashboardView } from './components/dashboard/DashboardView';
import { CRMKanban } from './components/crm/CRMKanban';
import { ClientList } from './components/clients/ClientList';
import { ClientModal } from './components/clients/ClientModal';
import { QuoteList } from './components/quotes/QuoteList';
import { QuoteModal } from './components/quotes/QuoteModal';
import { QuotePreviewModal } from './components/quotes/QuotePreviewModal';
import { ContractList } from './components/contracts/ContractList';
import { ContractModal } from './components/contracts/ContractModal';
import { FinancialDashboard } from './components/financial/FinancialDashboard';
import { FinancialModal } from './components/financial/FinancialModal';
import { InventoryList } from './components/inventory/InventoryList';
import { InventoryModal } from './components/inventory/InventoryModal';
import { CalendarView } from './components/calendar/CalendarView';
import { DocumentAnalyzer } from './components/documents/DocumentAnalyzer';
import { AuditLogView } from './components/audit/AuditLogView';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { PlansAndBillingModal } from './components/admin/PlansAndBillingModal';

export function App() {
  // Global Application State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('erp_language');
    return (saved as Language) || 'pt';
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('erp_dark_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Data Collections (persisted via LocalStorage)
  const [companies, setCompanies] = useState<Company[]>(() => getStoredData('companies', initialCompanies));
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companies[0]?.id || 'comp_1');

  const [clients, setClients] = useState<Client[]>(() => getStoredData('clients', initialClients));
  const [quotes, setQuotes] = useState<Quote[]>(() => getStoredData('quotes', initialQuotes));
  const [contracts, setContracts] = useState<Contract[]>(() => getStoredData('contracts', initialContracts));
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => getStoredData('transactions', initialTransactions));
  const [inventory, setInventory] = useState<ProductItem[]>(() => getStoredData('inventory', initialInventory));
  const [calendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // UI Drawer & Modal Toggle States
  const [isAIAgentOpen, setIsAIAgentOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteToPreview, setQuoteToPreview] = useState<Quote | null>(null);

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductItem | null>(null);

  const currentCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0] || initialCompanies[0];

  // Sync dark mode class with HTML element and localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('erp_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('erp_language', language);
  }, [language]);

  // Save changes to localStorage
  useEffect(() => { setStoredData('companies', companies); }, [companies]);
  useEffect(() => { setStoredData('clients', clients); }, [clients]);
  useEffect(() => { setStoredData('quotes', quotes); }, [quotes]);
  useEffect(() => { setStoredData('contracts', contracts); }, [contracts]);
  useEffect(() => { setStoredData('transactions', transactions); }, [transactions]);
  useEffect(() => { setStoredData('inventory', inventory); }, [inventory]);

  // Helper function to log audit actions
  const logAudit = (action: string, module: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userName: 'Gestor Principal',
      action,
      module,
      companyId: currentCompany.id,
      ipAddress: '192.168.1.45',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // CLIENT HANDLERS
  const handleSaveClient = (clientData: Partial<Client>) => {
    if (clientData.id) {
      setClients((prev) =>
        prev.map((c) => (c.id === clientData.id ? { ...c, ...clientData } as Client : c))
      );
      logAudit(`Cliente ${clientData.name} atualizado`, 'CRM');
    } else {
      const newClient: Client = {
        id: `cli_${Date.now()}`,
        companyId: currentCompany.id,
        name: clientData.name || '',
        email: clientData.email || '',
        phone: clientData.phone || '',
        nif: clientData.nif || '',
        companyName: clientData.companyName,
        address: clientData.address,
        city: clientData.city,
        tags: clientData.tags || [],
        stage: clientData.stage || 'lead',
        dealValue: clientData.dealValue || 0,
        createdAt: new Date().toISOString(),
      };
      setClients((prev) => [newClient, ...prev]);
      logAudit(`Novo cliente ${newClient.name} cadastrado`, 'CRM');
    }
  };

  const handleUpdateClientStage = (clientId: string, newStage: PipelineStage) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, stage: newStage } : c))
    );
    logAudit(`Etapa de cliente alterada para ${newStage}`, 'CRM');
  };

  const handleDeleteClient = (clientId: string) => {
    setClients((prev) => prev.filter((c) => c.id !== clientId));
    logAudit(`Cliente removido`, 'CRM');
  };

  // QUOTE HANDLERS
  const handleSaveQuote = (quoteData: Partial<Quote>) => {
    const newQuote: Quote = {
      id: `q_${Date.now()}`,
      number: quoteData.number || `ORC-${Date.now()}`,
      companyId: currentCompany.id,
      clientId: quoteData.clientId || '',
      clientName: quoteData.clientName || '',
      clientEmail: quoteData.clientEmail || '',
      clientPhone: quoteData.clientPhone || '',
      clientNif: quoteData.clientNif,
      date: quoteData.date || new Date().toISOString().split('T')[0],
      dueDate: quoteData.dueDate || '2026-08-30',
      items: quoteData.items || [],
      subtotal: quoteData.subtotal || 0,
      taxTotal: quoteData.taxTotal || 0,
      discount: quoteData.discount || 0,
      total: quoteData.total || 0,
      notes: quoteData.notes || '',
      terms: quoteData.terms,
      warranty: quoteData.warranty,
      status: quoteData.status || 'enviado',
      createdAt: new Date().toISOString(),
    };

    setQuotes((prev) => [newQuote, ...prev]);
    logAudit(`Orçamento ${newQuote.number} criado para ${newQuote.clientName}`, 'Orçamentos');
  };

  const handleConvertQuoteToContract = (quote: Quote) => {
    const newContract: Contract = {
      id: `ctr_${Date.now()}`,
      number: `CTR-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
      companyId: currentCompany.id,
      clientId: quote.clientId,
      clientName: quote.clientName,
      clientNif: quote.clientNif || 'N/A',
      title: `Contrato de Prestação referente a ${quote.number}`,
      type: 'prestacao_servico',
      value: quote.total,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2027-07-31',
      clauses: [
        'CLÁUSULA 1ª - Prestação de serviços conforme descritivo do orçamento.',
        'CLÁUSULA 2ª - Pagamento em conformidade com as condições acordadas.',
      ],
      status: 'ativo',
      createdAt: new Date().toISOString(),
    };

    setContracts((prev) => [newContract, ...prev]);
    setQuotes((prev) =>
      prev.map((q) => (q.id === quote.id ? { ...q, status: 'convertido' } : q))
    );
    logAudit(`Orçamento ${quote.number} convertido em Contrato ${newContract.number}`, 'Contratos');
  };

  // FINANCIAL HANDLERS
  const handleSaveTransaction = (trData: Partial<FinancialTransaction>) => {
    const newTr: FinancialTransaction = {
      id: `tr_${Date.now()}`,
      companyId: currentCompany.id,
      type: trData.type || 'receita',
      description: trData.description || '',
      category: trData.category || 'Serviços',
      amount: trData.amount || 0,
      date: trData.date || new Date().toISOString().split('T')[0],
      dueDate: trData.dueDate || new Date().toISOString().split('T')[0],
      status: trData.status || 'pago',
      clientId: trData.clientId,
      clientName: trData.clientName,
      costCenter: trData.costCenter,
      paymentMethod: trData.paymentMethod,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTr, ...prev]);
    logAudit(`Transação ${newTr.description} registrada`, 'Finanças');
  };

  const handleUpdateTransactionStatus = (id: string, newStatus: 'pago' | 'pendente' | 'atrasado') => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    logAudit(`Status de transação atualizado para ${newStatus}`, 'Finanças');
  };

  // INVENTORY HANDLERS
  const handleSaveProduct = (pData: Partial<ProductItem>) => {
    if (pData.id) {
      setInventory((prev) =>
        prev.map((i) => (i.id === pData.id ? { ...i, ...pData } as ProductItem : i))
      );
      logAudit(`Item de estoque ${pData.name} atualizado`, 'Estoque');
    } else {
      const newProduct: ProductItem = {
        id: `prod_${Date.now()}`,
        companyId: currentCompany.id,
        sku: pData.sku || `SKU-${Date.now()}`,
        name: pData.name || '',
        description: pData.description || '',
        type: pData.type || 'produto',
        category: pData.category || 'Geral',
        price: pData.price || 0,
        cost: pData.cost || 0,
        quantity: pData.quantity || 0,
        minQuantity: pData.minQuantity || 0,
        unit: pData.unit || 'unid',
      };
      setInventory((prev) => [newProduct, ...prev]);
      logAudit(`Novo item ${newProduct.name} cadastrado no estoque`, 'Estoque');
    }
  };

  const handleDeleteProduct = (id: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== id));
    logAudit(`Item removido do estoque`, 'Estoque');
  };

  // CONTRACT HANDLER
  const handleSaveContract = (cData: Partial<Contract>) => {
    const newContract: Contract = {
      id: `ctr_${Date.now()}`,
      number: cData.number || `CTR-${Date.now()}`,
      companyId: currentCompany.id,
      clientId: cData.clientId || '',
      clientName: cData.clientName || '',
      clientNif: cData.clientNif || 'N/A',
      title: cData.title || '',
      type: cData.type || 'prestacao_servico',
      value: cData.value || 0,
      startDate: cData.startDate || '2026-08-01',
      endDate: cData.endDate || '2027-07-31',
      clauses: cData.clauses || [],
      status: 'ativo',
      createdAt: new Date().toISOString(),
    };
    setContracts((prev) => [newContract, ...prev]);
    logAudit(`Contrato ${newContract.number} gerado`, 'Contratos');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation Header */}
      <Navbar
        currentCompany={currentCompany}
        companies={companies}
        selectedCompanyId={selectedCompanyId}
        onSelectCompany={(comp) => setSelectedCompanyId(comp.id)}
        language={language}
        onSelectLanguage={setLanguage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenAIAgent={() => setIsAIAgentOpen(true)}
        onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
        onOpenPlans={() => setIsPlansModalOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onNavigateTab={setActiveTab}
          language={language}
          onOpenAIAgent={() => setIsAIAgentOpen(true)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentCompany={currentCompany}
              clients={clients}
              quotes={quotes}
              transactions={transactions}
              calendarEvents={calendarEvents}
              inventory={inventory}
              language={language}
              onNavigateTab={setActiveTab}
              onOpenNewQuote={() => setIsQuoteModalOpen(true)}
              onOpenNewClient={() => {
                setClientToEdit(null);
                setIsClientModalOpen(true);
              }}
              onOpenNewTransaction={() => setIsFinancialModalOpen(true)}
            />
          )}

          {activeTab === 'crm' && (
            <CRMKanban
              clients={clients}
              currentCompany={currentCompany}
              language={language}
              onUpdateClientStage={handleUpdateClientStage}
              onOpenNewClientModal={() => {
                setClientToEdit(null);
                setIsClientModalOpen(true);
              }}
              onOpenClientDetails={(client) => {
                setClientToEdit(client);
                setIsClientModalOpen(true);
              }}
            />
          )}

          {activeTab === 'clients' && (
            <ClientList
              clients={clients}
              currentCompany={currentCompany}
              language={language}
              onOpenNewClientModal={() => {
                setClientToEdit(null);
                setIsClientModalOpen(true);
              }}
              onEditClient={(client) => {
                setClientToEdit(client);
                setIsClientModalOpen(true);
              }}
              onDeleteClient={handleDeleteClient}
              onCreateQuoteForClient={(client) => {
                setClientToEdit(client);
                setIsQuoteModalOpen(true);
              }}
            />
          )}

          {activeTab === 'quotes' && (
            <QuoteList
              quotes={quotes}
              currentCompany={currentCompany}
              language={language}
              onOpenNewQuoteModal={() => setIsQuoteModalOpen(true)}
              onViewQuotePreview={(quote) => setQuoteToPreview(quote)}
              onConvertQuoteToContract={handleConvertQuoteToContract}
            />
          )}

          {activeTab === 'contracts' && (
            <ContractList
              contracts={contracts}
              currentCompany={currentCompany}
              language={language}
              onOpenNewContractModal={() => setIsContractModalOpen(true)}
            />
          )}

          {activeTab === 'finances' && (
            <FinancialDashboard
              transactions={transactions}
              currentCompany={currentCompany}
              language={language}
              onOpenNewTransactionModal={() => setIsFinancialModalOpen(true)}
              onUpdateTransactionStatus={handleUpdateTransactionStatus}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryList
              inventory={inventory}
              currentCompany={currentCompany}
              language={language}
              onOpenNewProductModal={() => {
                setProductToEdit(null);
                setIsInventoryModalOpen(true);
              }}
              onEditProduct={(prod) => {
                setProductToEdit(prod);
                setIsInventoryModalOpen(true);
              }}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView events={calendarEvents} currentCompany={currentCompany} language={language} />
          )}

          {activeTab === 'documents' && (
            <DocumentAnalyzer currentCompany={currentCompany} language={language} />
          )}

          {activeTab === 'audit' && (
            <AuditLogView logs={auditLogs} currentCompany={currentCompany} />
          )}

          {activeTab === 'settings' && (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl">
              <h3 className="font-bold text-lg mb-2">Configurações da Empresa</h3>
              <p className="text-xs text-slate-400 mb-4">Empresa em foco: {currentCompany.name}</p>
              <div className="space-y-3 text-xs">
                <div><strong>NIF/CNPJ:</strong> {currentCompany.nif}</div>
                <div><strong>E-mail:</strong> {currentCompany.email}</div>
                <div><strong>Moeda Padrão:</strong> {currentCompany.currency}</div>
                <div><strong>Servidores de Envio (WhatsApp / SMTP):</strong> Conectados e operacionais.</div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Executable AI Employee Drawer */}
      <AIAgentDrawer
        isOpen={isAIAgentOpen}
        onClose={() => setIsAIAgentOpen(false)}
        currentCompany={currentCompany}
        clients={clients}
        quotes={quotes}
        transactions={transactions}
        inventory={inventory}
        language={language}
        onExecuteAction={(action) => {
          logAudit(`Agente IA executou ação de ${action.type}`, 'Agente IA');
        }}
      />

      {/* Modals & Dialogs */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSaveClient={handleSaveClient}
        clientToEdit={clientToEdit}
        companyId={currentCompany.id}
      />

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        onSaveQuote={handleSaveQuote}
        clients={clients}
        currentCompany={currentCompany}
        preselectedClient={clientToEdit}
      />

      <QuotePreviewModal
        quote={quoteToPreview}
        onClose={() => setQuoteToPreview(null)}
        currentCompany={currentCompany}
        onApproveQuote={(id) => {
          setQuotes((prev) =>
            prev.map((q) => (q.id === id ? { ...q, status: 'aprovado', signedAt: new Date().toISOString() } : q))
          );
        }}
      />

      <FinancialModal
        isOpen={isFinancialModalOpen}
        onClose={() => setIsFinancialModalOpen(false)}
        onSaveTransaction={handleSaveTransaction}
        clients={clients}
        currentCompany={currentCompany}
      />

      <InventoryModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        onSaveProduct={handleSaveProduct}
        productToEdit={productToEdit}
        currentCompany={currentCompany}
      />

      <ContractModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        onSaveContract={handleSaveContract}
        clients={clients}
        currentCompany={currentCompany}
      />

      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        clients={clients}
        quotes={quotes}
        inventory={inventory}
        transactions={transactions}
        onNavigateTab={setActiveTab}
      />

      <PlansAndBillingModal
        isOpen={isPlansModalOpen}
        onClose={() => setIsPlansModalOpen(false)}
        currentCompany={currentCompany}
        language={language}
      />
    </div>
  );
}

export default App;
