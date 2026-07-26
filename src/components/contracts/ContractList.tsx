import React, { useState } from 'react';
import {
  FileCheck, Plus, Search, Printer, MessageSquare, ShieldCheck, Clock, FileText
} from 'lucide-react';
import { Contract, Company, Language } from '../../types';
import { translations } from '../../lib/i18n';
import { generateContractPDF } from '../../lib/pdfGenerator';
import { generateContractWhatsAppUrl } from '../../lib/whatsapp';

interface ContractListProps {
  contracts: Contract[];
  currentCompany: Company;
  language: Language;
  onOpenNewContractModal: () => void;
}

export const ContractList: React.FC<ContractListProps> = ({
  contracts,
  currentCompany,
  language,
  onOpenNewContractModal,
}) => {
  const t = translations[language];
  const currencySymbol = currentCompany.currency === 'EUR' ? '€' : 'R$';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContracts = contracts.filter(
    (c) =>
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Contratos & Validação Jurídica
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Minutas de contratos geradas com IA para manutenção, serviços, consultoria e locação
          </p>
        </div>

        <button
          onClick={onOpenNewContractModal}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Gerar Novo Contrato</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por Número, Cliente ou Título do Contrato..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-3">
        {filteredContracts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            Nenhum contrato cadastrado.
          </div>
        ) : (
          filteredContracts.map((contract) => {
            const waUrl = generateContractWhatsAppUrl(contract, currentCompany);

            return (
              <div
                key={contract.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Info */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-sm shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                        {contract.number}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          contract.status === 'ativo'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {contract.status}
                      </span>
                    </div>

                    <div className="font-semibold text-sm text-slate-700 dark:text-slate-300 mt-0.5">
                      {contract.title}
                    </div>

                    <div className="text-xs text-slate-400 mt-1">
                      Cliente: <strong className="text-slate-300">{contract.clientName}</strong> • Vigência: {contract.startDate} até {contract.endDate}
                    </div>
                  </div>
                </div>

                {/* Right Value & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between md:justify-end">
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-slate-400">Valor do Contrato</div>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      {currencySymbol}{contract.value.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => generateContractPDF(contract, currentCompany)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimir PDF</span>
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
