import React from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, Users, FileText, AlertCircle,
  ArrowUpRight, Plus, MessageSquare, Calendar as CalendarIcon, CheckCircle, Package
} from 'lucide-react';
import {
  Company, Client, Quote, FinancialTransaction, CalendarEvent, ProductItem, Language
} from '../../types';
import { translations } from '../../lib/i18n';
import { AIDailyBriefingCard } from '../ai/AIDailyBriefingCard';
import { generatePaymentReminderWhatsAppUrl } from '../../lib/whatsapp';

interface DashboardViewProps {
  currentCompany: Company;
  clients: Client[];
  quotes: Quote[];
  transactions: FinancialTransaction[];
  calendarEvents: CalendarEvent[];
  inventory: ProductItem[];
  language: Language;
  onNavigateTab: (tab: any) => void;
  onOpenNewQuote: () => void;
  onOpenNewClient: () => void;
  onOpenNewTransaction: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentCompany,
  clients,
  quotes,
  transactions,
  calendarEvents,
  inventory,
  language,
  onNavigateTab,
  onOpenNewQuote,
  onOpenNewClient,
  onOpenNewTransaction,
}) => {
  const t = translations[language];
  const currencySymbol = currentCompany.currency === 'EUR' ? '€' : 'R$';

  // Metrics Calculations
  const revenueTransactions = transactions.filter((t) => t.type === 'receita' && t.status === 'pago');
  const monthlyRevenue = revenueTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  const expenseTransactions = transactions.filter((t) => t.type === 'despesa' && t.status === 'pago');
  const monthlyExpenses = expenseTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  const netProfit = monthlyRevenue - monthlyExpenses;

  const overdueTransactions = transactions.filter((t) => t.status === 'atrasado');
  const overdueAmount = overdueTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  const pendingReceivables = transactions
    .filter((t) => t.type === 'receita' && t.status === 'pendente')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const activeClientsCount = clients.length;
  const lowStockCount = inventory.filter((item) => item.quantity <= item.minQuantity).length;
  const pendingQuotesCount = quotes.filter((q) => q.status === 'enviado').length;

  return (
    <div className="space-y-6">
      {/* Strategic Executive AI Briefing Top Card */}
      <AIDailyBriefingCard
        currentCompany={currentCompany}
        monthlyRevenue={monthlyRevenue}
        overdueAmount={overdueAmount}
        overdueCount={overdueTransactions.length}
        lowStockCount={lowStockCount}
        pendingQuotesCount={pendingQuotesCount}
        language={language}
      />

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Receita do Mês */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.revenue}
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {currencySymbol}{monthlyRevenue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% em relação ao mês anterior</span>
          </div>
        </div>

        {/* Metric 2: Lucro Líquido */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.profit}
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {currencySymbol}{netProfit.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Despesas totais: {currencySymbol}{monthlyExpenses.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Metric 3: Inadimplência / Pagamentos Atrasados */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.overdue}
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
            {currencySymbol}{overdueAmount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-slate-400 font-medium">
            {overdueTransactions.length} títulos aguardando cobrança
          </div>
        </div>

        {/* Metric 4: Clientes Ativos */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.activeClients}
            </span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {activeClientsCount}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {clients.filter((c) => c.stage === 'fechado').length} contratos ativos no CRM
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
          Ações Rápidas de Gestão:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenNewQuote}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.newQuote}</span>
          </button>

          <button
            onClick={onOpenNewClient}
            className="px-3.5 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.newClient}</span>
          </button>

          <button
            onClick={onOpenNewTransaction}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.newTransaction}</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Recent Quotes & Overdue Debtor Collection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Recent Quotes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Últimos Orçamentos Enviados
            </h3>
            <button
              onClick={() => onNavigateTab('quotes')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver todos →
            </button>
          </div>

          <div className="space-y-3">
            {quotes.slice(0, 4).map((quote) => (
              <div
                key={quote.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{quote.clientName}</div>
                  <div className="text-xs text-slate-400">{quote.number} • Validade {quote.dueDate}</div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {currencySymbol}{quote.total.toFixed(2)}
                  </div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      quote.status === 'aprovado'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : quote.status === 'enviado'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-500/10 text-slate-400'
                    }`}
                  >
                    {quote.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Inadimplência & Cobrança Inteligente WhatsApp */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              Cobrança Inteligente por WhatsApp (IA)
            </h3>
            <button
              onClick={() => onNavigateTab('finances')}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
            >
              Ir para Finanças →
            </button>
          </div>

          {overdueTransactions.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              <CheckCircle className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
              Parabéns! Não existem clientes com pagamentos em atraso.
            </div>
          ) : (
            <div className="space-y-3">
              {overdueTransactions.map((tr) => {
                const waUrl = generatePaymentReminderWhatsAppUrl(tr, currentCompany);
                return (
                  <div
                    key={tr.id}
                    className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {tr.clientName || tr.description}
                      </div>
                      <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                        Vencido em {tr.dueDate} • Valor: {currencySymbol}{tr.amount.toFixed(2)}
                      </div>
                    </div>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors shrink-0"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Cobrar via WhatsApp</span>
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
