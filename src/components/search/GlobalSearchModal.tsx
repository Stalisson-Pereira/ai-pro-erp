import React, { useState, useEffect } from 'react';
import { Search, X, Users, FileText, Package, DollarSign, ArrowRight } from 'lucide-react';
import { Client, Quote, ProductItem, FinancialTransaction } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  quotes: Quote[];
  inventory: ProductItem[];
  transactions: FinancialTransaction[];
  onNavigateTab: (tab: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  clients,
  quotes,
  inventory,
  transactions,
  onNavigateTab,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const matchedClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      c.nif.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const matchedQuotes = quotes.filter(
    (q) =>
      q.clientName.toLowerCase().includes(query.toLowerCase()) ||
      q.number.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const matchedInventory = inventory.filter(
    (i) =>
      i.name.toLowerCase().includes(query.toLowerCase()) ||
      i.sku.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por Clientes, Orçamentos, Produtos ou Transações..."
            className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-slate-400">
              Digite acima para buscar registros em todo o ERP AI PRO...
            </div>
          ) : (
            <>
              {/* Clients section */}
              {matchedClients.length > 0 && (
                <div>
                  <div className="font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span>Clientes ({matchedClients.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedClients.map((client) => (
                      <div
                        key={client.id}
                        onClick={() => {
                          onNavigateTab('crm');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{client.name}</div>
                          <div className="text-[11px] text-slate-400">{client.email} • NIF: {client.nif}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quotes section */}
              {matchedQuotes.length > 0 && (
                <div>
                  <div className="font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Orçamentos ({matchedQuotes.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedQuotes.map((quote) => (
                      <div
                        key={quote.id}
                        onClick={() => {
                          onNavigateTab('quotes');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{quote.number} - {quote.clientName}</div>
                          <div className="text-[11px] text-slate-400">Total: {quote.total.toFixed(2)}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inventory section */}
              {matchedInventory.length > 0 && (
                <div>
                  <div className="font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-amber-500" />
                    <span>Estoque / Serviços ({matchedInventory.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedInventory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onNavigateTab('inventory');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{item.name}</div>
                          <div className="text-[11px] text-slate-400">SKU: {item.sku} • Preço: {item.price.toFixed(2)}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
