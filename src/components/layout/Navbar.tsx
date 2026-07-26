import React, { useState, useEffect, useRef } from 'react';
import {
  Building2, Search, Globe, Moon, Sun, Sparkles, ChevronDown, Check, ShieldCheck, Menu, LogOut, User as UserIcon
} from 'lucide-react';
import { Company, Language, User as UserType } from '../../types';
import { translations } from '../../lib/i18n';

interface NavbarProps {
  currentCompany?: Company;
  companies?: Company[];
  selectedCompanyId?: string;
  onSelectCompany?: (company: Company) => void;
  currentUser?: UserType;
  language?: Language;
  onSelectLanguage?: (lang: Language) => void;
  theme?: 'dark' | 'light';
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onToggleDarkMode?: () => void;
  onOpenSearch?: () => void;
  onOpenGlobalSearch?: () => void;
  onOpenAIAgent?: () => void;
  onOpenPlans?: () => void;
  onToggleMobileMenu?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCompany,
  companies = [],
  selectedCompanyId,
  onSelectCompany,
  currentUser,
  language = 'pt',
  onSelectLanguage,
  theme,
  isDarkMode,
  onToggleTheme,
  onToggleDarkMode,
  onOpenSearch,
  onOpenGlobalSearch,
  onOpenAIAgent,
  onOpenPlans,
  onToggleMobileMenu,
  onLogout,
}) => {
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setShowCompanyDropdown(false);
        setShowLangDropdown(false);
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const safeLang = language && translations[language] ? language : 'pt';
  const t = translations[safeLang] || translations.pt;

  const activeCompany: Company = currentCompany ||
    companies.find((c) => c.id === selectedCompanyId) ||
    companies[0] || {
      id: 'comp_1',
      name: 'Empresa Principal',
      nif: '500123456',
      email: 'contato@empresa.com',
      currency: 'EUR',
      plan: 'PRO',
      createdAt: new Date().toISOString(),
    };

  const activeUser: UserType = currentUser || {
    id: 'u_1',
    companyId: activeCompany.id,
    name: 'Gestor Principal',
    email: 'gestor@empresa.com',
    role: 'Administrador',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
  };

  const handleToggleDark = onToggleDarkMode || onToggleTheme || (() => {});
  const handleSearch = onOpenGlobalSearch || onOpenSearch || (() => {});
  const handleAIAgent = onOpenAIAgent || (() => {});
  const handlePlans = onOpenPlans || (() => {});

  const isDark = isDarkMode ?? (theme === 'dark');

  const langLabels: Record<Language, { label: string; flag: string }> = {
    pt: { label: 'PT', flag: '🇵🇹' },
    en: { label: 'EN', flag: '🇬🇧' },
    es: { label: 'ES', flag: '🇪🇸' },
    fr: { label: 'FR', flag: '🇫🇷' },
  };

  return (
    <header ref={navRef} className="sticky top-0 z-40 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3 sm:px-4 lg:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Drawer Hamburger & Company Selector */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Menu de Navegação"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Company Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            id="company-switcher-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowCompanyDropdown(!showCompanyDropdown);
              setShowLangDropdown(false);
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-800 dark:text-slate-100 text-sm font-semibold"
          >
            <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {(activeCompany.name || 'E').charAt(0)}
            </div>
            <span className="max-w-[160px] truncate">{activeCompany.name || 'Empresa'}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showCompanyDropdown && (
            <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50">
              <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Sua Organização
              </div>
              {companies.map((comp) => (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => {
                    if (onSelectCompany) onSelectCompany(comp);
                    setShowCompanyDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm text-slate-700 dark:text-slate-200"
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">{comp.name}</div>
                      <div className="text-xs text-slate-400">NIF: {comp.nif}</div>
                    </div>
                  </div>
                  {comp.id === activeCompany.id && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              ))}

              <div className="border-t border-slate-200 dark:border-slate-800 mt-2 pt-2 px-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCompanyDropdown(false);
                    handlePlans();
                  }}
                  className="w-full text-center px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                >
                  + Adicionar ou Gerenciar Empresa
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Plan Badge */}
        <button
          type="button"
          onClick={handlePlans}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:opacity-95 transition-opacity"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wider text-[10px] font-bold">Plano {activeCompany.plan || 'PRO'}</span>
        </button>
      </div>

      {/* Center: Search trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          type="button"
          onClick={handleSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span>{t.searchPlaceholder}</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls: AI Floating Agent, Lang, Theme, User */}
      <div className="flex items-center gap-2.5">
        {/* Trigger AI Virtual Employee Drawer */}
        <button
          type="button"
          id="ai-virtual-employee-btn"
          onClick={handleAIAgent}
          className="relative group flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white text-sm font-medium shadow-md hover:shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
          <span className="hidden sm:inline">{t.aiAgent}</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>

        {/* Language Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowLangDropdown(!showLangDropdown);
              setShowCompanyDropdown(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold"
            title={t.language}
          >
            <Globe className="w-4 h-4 text-blue-500" />
            <span className="uppercase">{langLabels[safeLang]?.flag} {langLabels[safeLang]?.label}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs">
              {(['pt', 'en', 'es', 'fr'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectLanguage) onSelectLanguage(lang);
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                    safeLang === lang ? 'font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{langLabels[lang]?.flag}</span>
                    <span>{lang === 'pt' ? 'Português' : lang === 'en' ? 'English' : lang === 'es' ? 'Español' : 'Français'}</span>
                  </span>
                  {safeLang === lang && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleDark();
          }}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 active:scale-95"
          title="Alternar Tema Claro/Escuro"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative pl-1 border-l border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowUserDropdown(!showUserDropdown);
              setShowCompanyDropdown(false);
              setShowLangDropdown(false);
            }}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={activeUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={activeUser.name || 'Usuário'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-800 shrink-0"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{activeUser.name || 'Gestor'}</div>
              <div className="text-[10px] text-slate-400 capitalize">{activeUser.role || 'Admin'}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Quick Direct Logout Button */}
          <button
            type="button"
            onClick={() => {
              if (onLogout) onLogout();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all text-xs font-semibold active:scale-95"
            title="Sair da Conta (Logout)"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{activeUser.name}</div>
                <div className="text-slate-400 truncate text-[11px]">{activeUser.email}</div>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  Plano {activeCompany.plan || 'PRO'}
                </span>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    handlePlans();
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-blue-500" />
                  <span>Gerenciar Empresas & Planos</span>
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors font-semibold"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sair da Conta (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
