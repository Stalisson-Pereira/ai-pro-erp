import React, { useState } from 'react';
import { X, FileCheck, Save, Sparkles } from 'lucide-react';
import { Contract, Client, ContractType, Company } from '../../types';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveContract: (contractData: Partial<Contract>) => void;
  clients: Client[];
  currentCompany: Company;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  isOpen,
  onClose,
  onSaveContract,
  clients,
  currentCompany,
}) => {
  if (!isOpen) return null;

  const defaultClient = clients[0];

  const [selectedClientId, setSelectedClientId] = useState(defaultClient?.id || '');
  const [title, setTitle] = useState('Contrato de Prestação de Serviços Técnicos');
  const [type, setType] = useState<ContractType>('manutencao');
  const [value, setValue] = useState<number>(2400);
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2027-07-31');

  const [clauses, setClauses] = useState<string[]>([
    'CLÁUSULA 1ª - O PRESTADOR compromete-se a prestar serviços técnicos especializados com atendimento em até 4 horas úteis.',
    'CLÁUSULA 2ª - O valor contratual total é de €2.400,00, pagos em parcelas mensais de €200,00.',
    'CLÁUSULA 3ª - O presente contrato vigora pelo período de 12 meses, renovável por igual período salvo aviso prévio de 30 dias.',
    'CLÁUSULA 4ª - Foro da comarca de Lisboa para dirimir eventuais dúvidas.',
  ]);

  const currentClient = clients.find((c) => c.id === selectedClientId) || defaultClient;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient) return;

    const newNumber = `CTR-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`;

    onSaveContract({
      number: newNumber,
      companyId: currentCompany.id,
      clientId: currentClient.id,
      clientName: currentClient.name,
      clientNif: currentClient.nif,
      title,
      type,
      value: Number(value) || 0,
      startDate,
      endDate,
      clauses,
      status: 'ativo',
      createdAt: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-violet-500" />
            Gerar Contrato com IA
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Cliente & Tipo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Cliente *</label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.companyName ? `(${c.companyName})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Tipo de Contrato</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ContractType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
              >
                <option value="prestacao_servico">Prestação de Serviço</option>
                <option value="manutencao">Manutenção Recorrente</option>
                <option value="consultoria">Consultoria Técnica</option>
                <option value="locacao">Locação de Equipamentos</option>
                <option value="desenvolvimento">Desenvolvimento de Software</option>
              </select>
            </div>
          </div>

          {/* Título & Valor */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1">Título do Objeto *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Valor Total ({currentCompany.currency})</label>
              <input
                type="number"
                required
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
              />
            </div>
          </div>

          {/* Vigência */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Data Inicial</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Data Término</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
          </div>

          {/* Cláusulas */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Cláusulas Principais (Editável)</label>
            <div className="space-y-2">
              {clauses.map((clause, idx) => (
                <textarea
                  key={idx}
                  rows={2}
                  value={clause}
                  onChange={(e) => {
                    const newClauses = [...clauses];
                    newClauses[idx] = e.target.value;
                    setClauses(newClauses);
                  }}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              ))}
            </div>
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
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <Save className="w-4 h-4" />
              <span>Gerar Minuta de Contrato</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
