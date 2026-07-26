import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, Plus, Search, MessageSquare, AlertCircle,
  Filter, CheckCircle, Clock, Tag
} from 'lucide-react';
import { FinancialTransaction, Company, Language } from '../../types';
import { translations } from '../../lib/i18n';
import { generatePaymentReminderWhatsAppUrl } from '../../lib/whatsapp';

interface FinancialDashboardProps {
  transactions: FinancialTransaction[];
  currentCompany: Company;
  language: Language;
  onOpenNewTransactionModal: () => void;
  onUpdateTransactionStatus: (id: string, newStatus: 'pago' | 'pendente' | 'atrasado') => void;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  transactions,
  currentCompany,
  language,
  onOpenNewTransactionModal,
  onUpdateTransactionStatus,
}) => {
  const t = translations[language];
  const currencySymbol = currentCompany.currency === 'EUR' ? '€' : 'R$';
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'todos' | 'receita' | 'despesa'>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const totalIncomes = transactions
    .filter((t) => t.type === 'receita' && t.status === 'pago')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'despesa' && t.status === 'pago')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncomes - totalExpenses;

  const totalOverdue = transactions
    .filter((t) => t.status === 'atrasado')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const filteredTransactions = transactions.filter((tr) => {
    const matchesSearch =
      tr.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tr.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tr.clientName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'todos' ? true : tr.type === typeFilter;
    const matchesStatus = statusFilter === 'todos' ? true : tr.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Gestão Financeira & Fluxo de Caixa
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Controle de receitas, despesas, centros de custo e cobrança inteligente de inadimplência
          </p>
        </div>

        <button
          onClick={onOpenNewTransactionModal}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Transação</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Receitas Pago</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {currencySymbol}{totalIncomes.toFixed(2)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Despesas Pago</div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {currencySymbol}{totalExpenses.toFixed(2)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Saldo em Caixa</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {currencySymbol}{balance.toFixed(2)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Atrasados / Cobrança</div>
          <div className="text-2xl font-black text-rose-500">
            {currencySymbol}{totalOverdue.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por descrição, cliente ou categoria..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
            <button
              onClick={() => setTypeFilter('todos')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${typeFilter === 'todos' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setTypeFilter('receita')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${typeFilter === 'receita' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'}`}
            >
              Receitas
            </button>
            <button
              onClick={() => setTypeFilter('despesa')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${typeFilter === 'despesa' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500'}`}
            >
              Despesas
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                <th className="py-3 px-4">Descrição</th>
                <th className="py-3 px-4">Categoria / Custo</th>
                <th className="py-3 px-4">Cliente Alvo</th>
                <th className="py-3 px-4">Vencimento</th>
                <th className="py-3 px-4 text-right">Valor</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Cobrança / Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Nenhuma transação financeira encontrada.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tr) => {
                  const waUrl = generatePaymentReminderWhatsAppUrl(tr, currentCompany);

                  return (
                    <tr key={tr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                        {tr.description}
                      </td>

                      <td className="py-3 px-4 text-slate-500">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold">
                          {tr.category}
                        </span>
                        {tr.costCenter && <span className="ml-1 text-[10px] text-slate-400">({tr.costCenter})</span>}
                      </td>

                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {tr.clientName || 'Geral'}
                      </td>

                      <td className="py-3 px-4 text-slate-500">
                        {tr.dueDate}
                      </td>

                      <td
                        className={`py-3 px-4 text-right font-extrabold text-sm ${
                          tr.type === 'receita' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {tr.type === 'receita' ? '+' : '-'}{currencySymbol}{tr.amount.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <select
                          value={tr.status}
                          onChange={(e) => onUpdateTransactionStatus(tr.id, e.target.value as any)}
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer border-none focus:outline-none ${
                            tr.status === 'pago'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : tr.status === 'atrasado'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              : 'bg-amber-500/10 text-amber-500'
                          }`}
                        >
                          <option value="pago">Pago</option>
                          <option value="pendente">Pendente</option>
                          <option value="atrasado">Atrasado</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {tr.status === 'atrasado' ? (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition-colors"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Cobrar WhatsApp</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400">OK</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
