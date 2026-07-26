import React, { useState } from 'react';
import {
  Plus, Search, Phone, Mail, MapPin, Tag, ChevronRight, ChevronLeft, DollarSign,
  UserPlus, FileText, CheckCircle2, XCircle
} from 'lucide-react';
import { Client, PipelineStage, Company, Language } from '../../types';
import { translations } from '../../lib/i18n';

interface CRMKanbanProps {
  clients: Client[];
  currentCompany: Company;
  language: Language;
  onUpdateClientStage: (clientId: string, newStage: PipelineStage) => void;
  onOpenNewClientModal: () => void;
  onOpenClientDetails: (client: Client) => void;
}

export const CRMKanban: React.FC<CRMKanbanProps> = ({
  clients,
  currentCompany,
  language,
  onUpdateClientStage,
  onOpenNewClientModal,
  onOpenClientDetails,
}) => {
  const t = translations[language];
  const currencySymbol = currentCompany.currency === 'EUR' ? '€' : 'R$';
  const [searchQuery, setSearchQuery] = useState('');

  const stages: { id: PipelineStage; title: string; color: string; border: string }[] = [
    { id: 'lead', title: '1. Leads Iniciais', color: 'bg-slate-500/10 text-slate-400', border: 'border-slate-500/30' },
    { id: 'negociacao', title: '2. Em Negociação', color: 'bg-amber-500/10 text-amber-500', border: 'border-amber-500/30' },
    { id: 'proposta', title: '3. Proposta Enviada', color: 'bg-blue-500/10 text-blue-500', border: 'border-blue-500/30' },
    { id: 'fechado', title: '4. Fechado / Ganho', color: 'bg-emerald-500/10 text-emerald-500', border: 'border-emerald-500/30' },
    { id: 'perdido', title: '5. Perdido', color: 'bg-rose-500/10 text-rose-500', border: 'border-rose-500/30' },
  ];

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStageTotal = (stage: PipelineStage) => {
    return filteredClients
      .filter((c) => c.stage === stage)
      .reduce((acc, curr) => acc + (curr.dealValue || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Pipeline de Vendas & CRM
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gerencie o fluxo de oportunidade de negócios por etapas do funil
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search filter */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por nome ou tag..."
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            onClick={onOpenNewClientModal}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Lead</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
        {stages.map((st) => {
          const stageClients = filteredClients.filter((c) => c.stage === st.id);
          const stageTotal = getStageTotal(st.id);

          return (
            <div
              key={st.id}
              className="flex flex-col rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-3.5 min-w-[260px] h-[calc(100vh-250px)]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                <div>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${st.color} border ${st.border}`}>
                    {st.title}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                    Total: {currencySymbol}{stageTotal.toLocaleString('pt-PT', { minimumFractionDigits: 0 })}
                  </div>
                </div>
                <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                  {stageClients.length}
                </span>
              </div>

              {/* Cards List Area */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {stageClients.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-400 font-medium">
                    Nenhum cartão nesta etapa
                  </div>
                ) : (
                  stageClients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => onOpenClientDetails(client)}
                      className="group p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-blue-500/50 cursor-pointer transition-all"
                    >
                      {/* Name & Company */}
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {client.name}
                      </div>
                      {client.companyName && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {client.companyName}
                        </div>
                      )}

                      {/* Deal Value Badge */}
                      <div className="mt-2 text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                        {currencySymbol}{client.dealValue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                      </div>

                      {/* Tags */}
                      {client.tags.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {client.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Quick Stage Controls */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[10px] text-slate-400">Mover Etapa:</span>
                        <div className="flex items-center gap-1">
                          {st.id !== 'lead' && (
                            <button
                              onClick={() => {
                                const prevIdx = stages.findIndex((s) => s.id === st.id) - 1;
                                onUpdateClientStage(client.id, stages[prevIdx].id);
                              }}
                              className="p-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-200"
                              title="Voltar etapa"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {st.id !== 'perdido' && (
                            <button
                              onClick={() => {
                                const nextIdx = stages.findIndex((s) => s.id === st.id) + 1;
                                if (nextIdx < stages.length) {
                                  onUpdateClientStage(client.id, stages[nextIdx].id);
                                }
                              }}
                              className="p-1 rounded bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 text-blue-600 dark:text-blue-400"
                              title="Avançar etapa"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
