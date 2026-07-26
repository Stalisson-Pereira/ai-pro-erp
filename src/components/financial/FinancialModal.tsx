import React, { useState } from 'react';
import { X, DollarSign, Save } from 'lucide-react';
import { FinancialTransaction, TransactionType, Client, Company } from '../../types';

interface FinancialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTransaction: (transactionData: Partial<FinancialTransaction>) => void;
  clients: Client[];
  currentCompany: Company;
}

export const FinancialModal: React.FC<FinancialModalProps> = ({
  isOpen,
  onClose,
  onSaveTransaction,
  clients,
  currentCompany,
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<TransactionType>('receita');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Serviços');
  const [amount, setAmount] = useState<number>(450);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [costCenter, setCostCenter] = useState('Comercial');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'transferencia' | 'cartao' | 'boleto'>('transferencia');

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSaveTransaction({
      companyId: currentCompany.id,
      type,
      description,
      category,
      amount: Number(amount) || 0,
      date: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'pago',
      clientId: selectedClient?.id,
      clientName: selectedClient?.name,
      costCenter,
      paymentMethod,
      createdAt: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            Registrar Transação Financeira
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Tipo de Transação */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
            <button
              type="button"
              onClick={() => setType('receita')}
              className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                type === 'receita' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              + Entrada / Receita
            </button>
            <button
              type="button"
              onClick={() => setType('despesa')}
              className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                type === 'despesa' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              - Saída / Despesa
            </button>
          </div>

          {/* Descrição & Valor */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1">Descrição *</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Pagamento referente a serviços de TI"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Valor ({currentCompany.currency}) *</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* Categoria, Centro de Custo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
              >
                <option value="Serviços">Serviços</option>
                <option value="Contratos Recorrentes">Contratos Recorrentes</option>
                <option value="Fornecedores">Fornecedores</option>
                <option value="TI & Infraestrutura">TI & Infraestrutura</option>
                <option value="Salários">Salários / Pessoal</option>
                <option value="Impostos">Impostos & Taxas</option>
                <option value="Aluguel">Aluguel / Utilidades</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Centro de Custo</label>
              <select
                value={costCenter}
                onChange={(e) => setCostCenter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
              >
                <option value="Comercial">Comercial</option>
                <option value="Operacional">Operacional</option>
                <option value="Tecnologia">Tecnologia</option>
                <option value="Estoque">Estoque</option>
                <option value="Administrativo">Administrativo</option>
              </select>
            </div>
          </div>

          {/* Cliente Vincular & Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Vincular Cliente (Opcional)</label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
              >
                <option value="">Nenhum / Geral</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Data de Vencimento</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Forma de Pagamento</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
            >
              <option value="transferencia">Transferência Bancária</option>
              <option value="pix">PIX</option>
              <option value="cartao">Cartão de Crédito/Débito</option>
              <option value="boleto">Boleto Bancário</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Transação</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
