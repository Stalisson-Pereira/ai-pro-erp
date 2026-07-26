import React from 'react';
import { X, Printer, MessageSquare, FileCheck, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Quote, Company } from '../../types';
import { generateQuotePDF } from '../../lib/pdfGenerator';
import { generateQuoteWhatsAppUrl } from '../../lib/whatsapp';

interface QuotePreviewModalProps {
  quote: Quote | null;
  onClose: () => void;
  currentCompany: Company;
  onApproveQuote?: (quoteId: string) => void;
  onConvertQuoteToContract?: (quote: Quote) => void;
}

export const QuotePreviewModal: React.FC<QuotePreviewModalProps> = ({
  quote,
  onClose,
  currentCompany,
  onApproveQuote,
  onConvertQuoteToContract,
}) => {
  if (!quote) return null;

  const currencySymbol = currentCompany.currency === 'EUR' ? '€' : 'R$';
  const waUrl = generateQuoteWhatsAppUrl(quote, currentCompany);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div>
            <h3 className="font-extrabold text-base flex items-center gap-2">
              Visualização de Orçamento {quote.number}
            </h3>
            <div className="text-xs text-slate-500">Cliente: {quote.clientName}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => generateQuotePDF(quote, currentCompany)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 font-sans">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{currentCompany.name}</h2>
              <p className="text-xs text-slate-500 mt-1">
                NIF: {currentCompany.nif} | {currentCompany.email}<br />
                {currentCompany.phone} | {currentCompany.address}, {currentCompany.city}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">PROPOSTA COMERCIAL</span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{quote.number}</div>
              <div className="text-xs text-slate-400 mt-1">Data: {quote.date} | Validade: {quote.dueDate}</div>
            </div>
          </div>

          {/* Client Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">CLIENTE / CONTRATANTE</span>
              <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{quote.clientName}</div>
              <div className="text-slate-500">NIF/CPF: {quote.clientNif || 'N/A'}</div>
              <div className="text-slate-500">{quote.clientEmail}</div>
              <div className="text-slate-500">{quote.clientPhone}</div>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">CONDIÇÕES E GARANTIA</span>
              <div className="text-slate-700 dark:text-slate-300 font-medium">{quote.notes}</div>
              <div className="text-slate-500 mt-2"><strong>Garantia:</strong> {quote.warranty}</div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                  <th className="py-2.5 px-2">#</th>
                  <th className="py-2.5 px-2">Descrição</th>
                  <th className="py-2.5 px-2 text-center">Qtd</th>
                  <th className="py-2.5 px-2 text-right">P. Unitário</th>
                  <th className="py-2.5 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {quote.items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="py-2.5 px-2 text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-2 font-medium text-slate-900 dark:text-slate-100">{item.description}</td>
                    <td className="py-2.5 px-2 text-center">{item.quantity}</td>
                    <td className="py-2.5 px-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                    <td className="py-2.5 px-2 text-right font-extrabold">{currencySymbol}{item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Box */}
          <div className="w-full sm:w-64 ml-auto p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span>{currencySymbol}{quote.subtotal.toFixed(2)}</span>
            </div>

            {quote.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Desconto:</span>
                <span>-{currencySymbol}{quote.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-500">
              <span>Impostos Estimados:</span>
              <span>{currencySymbol}{quote.taxTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span>TOTAL GERAL:</span>
              <span className="text-blue-600 dark:text-blue-400">{currencySymbol}{quote.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Digital Signature Acceptance Simulator */}
          <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Aceite e Assinatura Digital</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {quote.signedAt
                  ? `Assinado por ${quote.clientName} em ${new Date(quote.signedAt).toLocaleString()}`
                  : 'Aguardando confirmação e assinatura digital do contratante.'}
              </div>
            </div>

            {quote.status !== 'aprovado' && onApproveQuote && (
              <button
                onClick={() => onApproveQuote(quote.id)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Simular Aceite do Cliente</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
