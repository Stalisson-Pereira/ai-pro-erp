import React, { useState } from 'react';
import {
  FileText, Plus, Search, MessageSquare, Printer, FileCheck, CheckCircle2, Clock, XCircle
} from 'lucide-react';
import { Quote, Company, Language } from '../../types';
import { translations } from '../../lib/i18n';
import { generateQuotePDF } from '../../lib/pdfGenerator';
import { generateQuoteWhatsAppUrl } from '../../lib/whatsapp';

interface QuoteListProps {
  quotes: Quote[];
  currentCompany: Company;
  language: Language;
  onOpenNewQuoteModal: () => void;
  onViewQuotePreview: (quote: Quote) => void;
  onConvertQuoteToContract: (quote: Quote) => void;
}

export const QuoteList: React.FC<QuoteListProps> = ({
  quotes,
  currentCompany,
  language,
  onOpenNewQuoteModal,
  onViewQuotePreview,
  onConvertQuoteToContract,
}) => {
  const t = translations[language];
  const currencySymbol = currentCompany.currency === 'EUR' ? '€' : 'R$';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.clientEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'todos' ? true : q.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Orçamentos & Propostas Comerciais
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Crie propostas com calculador de impostos, assinatura digital e exportação em PDF/WhatsApp
          </p>
        </div>

        <button
          onClick={onOpenNewQuoteModal}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Orçamento</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por Número, Cliente ou Email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 shrink-0">Status:</span>
          {['todos', 'rascunho', 'enviado', 'aprovado', 'convertido'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize shrink-0 transition-colors ${
                statusFilter === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Quotes Cards List */}
      <div className="space-y-3">
        {filteredQuotes.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            Nenhum orçamento encontrado nesta categoria.
          </div>
        ) : (
          filteredQuotes.map((quote) => {
            const waUrl = generateQuoteWhatsAppUrl(quote, currentCompany);

            return (
              <div
                key={quote.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Info */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{quote.number}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
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

                    <div className="font-semibold text-sm text-slate-700 dark:text-slate-300 mt-0.5">
                      {quote.clientName}
                    </div>

                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <span>Data: {quote.date}</span>
                      <span>Validade: {quote.dueDate}</span>
                      <span>Itens: {quote.items.length}</span>
                    </div>
                  </div>
                </div>

                {/* Right Total & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between md:justify-end">
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-slate-400">Valor Total com Impostos</div>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      {currencySymbol}{quote.total.toFixed(2)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewQuotePreview(quote)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                      title="Visualizar / Imprimir"
                    >
                      Ver Detalhes
                    </button>

                    <button
                      onClick={() => generateQuotePDF(quote, currentCompany)}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                      title="Imprimir / Baixar PDF"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                      title="Enviar por WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>

                    {quote.status !== 'convertido' && (
                      <button
                        onClick={() => onConvertQuoteToContract(quote)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                        title="Gerar Contrato a partir deste Orçamento"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Gerar Contrato</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
