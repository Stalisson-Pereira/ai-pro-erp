import React from 'react';
import {
  LayoutDashboard, Kanban, Users, FileText, FileCheck, DollarSign,
  Package, Calendar, FileSearch, ShieldAlert, CreditCard, Sparkles, X
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../lib/i18n';

export type ActiveTab =
  | 'dashboard'
  | 'crm'
  | 'clients'
  | 'quotes'
  | 'contracts'
  | 'finances'
  | 'inventory'
  | 'agenda'
  | 'documents'
  | 'audit'
  | 'plans';

interface SidebarProps {
  activeTab: ActiveTab | string;
  onSelectTab?: (tab: ActiveTab) => void;
  onNavigateTab?: (tab: string) => void;
  language: Language;
  overdueCount?: number;
  lowStockCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenAIAgent?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onNavigateTab,
  language = 'pt',
  overdueCount = 0,
  lowStockCount = 0,
  isOpenMobile = false,
  onCloseMobile,
  onOpenAIAgent,
}) => {
  const safeLang = language && translations[language] ? language : 'pt';
  const t = translations[safeLang] || translations.pt;

  const handleTabClick = (tabId: ActiveTab) => {
    if (onSelectTab) onSelectTab(tabId);
    if (onNavigateTab) onNavigateTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const menuItems = [
    { id: 'dashboard' as ActiveTab, label: t.dashboard, icon: LayoutDashboard },
    { id: 'crm' as ActiveTab, label: t.crm, icon: Kanban },
    { id: 'clients' as ActiveTab, label: t.clients, icon: Users },
    { id: 'quotes' as ActiveTab, label: t.quotes, icon: FileText },
    { id: 'contracts' as ActiveTab, label: t.contracts, icon: FileCheck },
    { id: 'finances' as ActiveTab, label: t.finances, icon: DollarSign, badge: overdueCount > 0 ? overdueCount : undefined, badgeColor: 'bg-rose-500' },
    { id: 'inventory' as ActiveTab, label: t.inventory, icon: Package, badge: lowStockCount > 0 ? lowStockCount : undefined, badgeColor: 'bg-amber-500' },
    { id: 'agenda' as ActiveTab, label: t.agenda, icon: Calendar },
    { id: 'documents' as ActiveTab, label: t.documents, icon: FileSearch },
    { id: 'audit' as ActiveTab, label: t.audit, icon: ShieldAlert },
    { id: 'plans' as ActiveTab, label: t.plans, icon: CreditCard },
  ];

  const content = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 border-r border-slate-800 transition-colors">
      {/* App Header Branding */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-blue-500/20">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base tracking-tight leading-none">ERP AI PRO</h1>
            <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">Agente Virtual Enterprise</span>
          </div>
        </div>

        {onCloseMobile && (
          <button onClick={onCloseMobile} className="lg:hidden p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Primary Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Módulos Principais
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 text-[10px] font-bold text-white rounded-full ${item.badgeColor || 'bg-blue-500'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* AI Assistant Quick Banner inside Sidebar */}
      <div className="p-3 m-3 bg-gradient-to-b from-indigo-950/60 to-slate-900 rounded-xl border border-indigo-500/20 shadow-inner">
        <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Atendimento por IA Ativo</span>
        </div>
        <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
          Sua IA executa cadastros, orçamentos e relatórios em tempo real.
        </p>
        <button
          onClick={() => {
            if (onOpenAIAgent) onOpenAIAgent();
            if (onCloseMobile) onCloseMobile();
          }}
          className="mt-2.5 w-full py-1.5 px-3 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Falar com Agente IA</span>
        </button>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span>ERP AI PRO v2.5</span>
        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Online
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 z-30 shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative z-10 w-64 max-w-xs h-full">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
