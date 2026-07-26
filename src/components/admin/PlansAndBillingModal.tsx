import React from 'react';
import { X, CheckCircle2, Zap, Building2, ShieldCheck, CreditCard } from 'lucide-react';
import { Company, Language } from '../../types';

interface PlansAndBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCompany: Company;
  language: Language;
}

export const PlansAndBillingModal: React.FC<PlansAndBillingModalProps> = ({
  isOpen,
  onClose,
  currentCompany,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Planos SaaS & Assinatura ERP AI PRO
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          {/* Current Active Plan Badge */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white border border-blue-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">Plano Atual</span>
              <h4 className="text-lg font-black text-white">Plano PRO Multi-Empresa</h4>
              <p className="text-slate-300 text-[11px]">Empresa ativa: {currentCompany.name} (NIF: {currentCompany.nif})</p>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/30">
                ATIVO
              </span>
            </div>
          </div>

          {/* SaaS Pricing Plans Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Starter Plan */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <div className="font-black text-sm">Plano Starter</div>
              <div className="text-xl font-black text-slate-900 dark:text-slate-100">€29 <span className="text-xs text-slate-400 font-normal">/mês</span></div>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Até 1 Empresa</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> CRM Pipeline Básico</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Orçamentos e PDF</li>
              </ul>
            </div>

            {/* PRO Plan */}
            <div className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 space-y-3 relative">
              <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] uppercase">
                Mais Popular
              </span>
              <div className="font-black text-sm text-blue-600 dark:text-blue-400">Plano PRO AI</div>
              <div className="text-xl font-black text-slate-900 dark:text-slate-100">€79 <span className="text-xs text-slate-400 font-normal">/mês</span></div>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Multi-Empresas Ilimitado</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Agente IA Executável Ativo</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Cobrança WhatsApp Automática</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Leitor OCR de Documentos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
