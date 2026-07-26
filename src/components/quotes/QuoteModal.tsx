import React, { useState } from 'react';
import { X, Plus, Trash2, FileText, Save, Calculator } from 'lucide-react';
import { Quote, Client, QuoteItem, Company } from '../../types';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveQuote: (quoteData: Partial<Quote>) => void;
  clients: Client[];
  currentCompany: Company;
  preselectedClient?: Client | null;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  onSaveQuote,
  clients,
  currentCompany,
  preselectedClient,
}) => {
  if (!isOpen) return null;

  const currencySymbol = currentCompany.currency === 'EUR' ? '€' : 'R$';

  const defaultClient = preselectedClient || clients[0];

  const [selectedClientId, setSelectedClientId] = useState(defaultClient?.id || '');
  const [dueDate, setDueDate] = useState('2026-08-15');
  const [discount, setDiscount] = useState<number>(50);
  const [notes, setNotes] = useState('Pagamento 50% na entrada e 50% na conclusão dos serviços.');
  const [terms, setTerms] = useState('Validade da proposta: 15 dias corridos.');
  const [warranty, setWarranty] = useState('Garantia de 90 dias.');

  const [items, setItems] = useState<QuoteItem[]>([
    {
      id: 'item_1',
      description: 'Serviço de Instalação e Configuração Técnica',
      quantity: 1,
      unitPrice: 850,
      taxPercent: 23,
      totalPrice: 850,
    },
  ]);

  const currentClient = clients.find((c) => c.id === selectedClientId) || defaultClient;

  const handleAddItem = () => {
    const newItem: QuoteItem = {
      id: `item_${Date.now()}`,
      description: 'Novo item / serviço',
      quantity: 1,
      unitPrice: 100,
      taxPercent: 23,
      totalPrice: 100,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.totalPrice = (updated.quantity || 0) * (updated.unitPrice || 0);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const subtotal = items.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const taxTotal = items.reduce((acc, curr) => acc + (curr.totalPrice * (curr.taxPercent / 100)), 0);
  const total = Math.max(0, subtotal + taxTotal - (discount || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient) return;

    const newQuoteNumber = `ORC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    onSaveQuote({
      number: newQuoteNumber,
      companyId: currentCompany.id,
      clientId: currentClient.id,
      clientName: currentClient.name,
      clientEmail: currentClient.email,
      clientPhone: currentClient.phone,
      clientNif: currentClient.nif,
      date: new Date().toISOString().split('T')[0],
      dueDate,
      items,
      subtotal,
      taxTotal,
      discount,
      total,
      notes,
      terms,
      warranty,
      status: 'enviado',
      createdAt: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            Criar Orçamento Inteligente
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Cliente e Validade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Cliente *</label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-blue-500 font-semibold"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.companyName ? `(${c.companyName})` : ''} - NIF: {c.nif}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Data de Validade *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Itens & Serviços do Orçamento
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 grid grid-cols-12 gap-2 items-center"
                >
                  <div className="col-span-12 sm:col-span-5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                      placeholder="Descrição do item"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      placeholder="Qtd"
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-center"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      placeholder="Preço Unit"
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-right"
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-2 text-right font-extrabold text-xs text-slate-900 dark:text-slate-100">
                    {currencySymbol}{item.totalPrice.toFixed(2)}
                  </div>

                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 rounded text-rose-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals Box */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Subtotal:</span>
              <span className="font-bold">{currencySymbol}{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 dark:text-slate-300">Desconto ({currencySymbol}):</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-28 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-right font-bold"
              />
            </div>

            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Impostos Estimados (23% IVA):</span>
              <span className="font-bold">{currencySymbol}{taxTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-700">
              <span>TOTAL FINAL:</span>
              <span className="text-blue-600 dark:text-blue-400">{currencySymbol}{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Observações e Termos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Condições de Pagamento / Notas</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Garantia e Termos</label>
              <textarea
                rows={2}
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <Save className="w-4 h-4" />
              <span>Gerar Orçamento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
