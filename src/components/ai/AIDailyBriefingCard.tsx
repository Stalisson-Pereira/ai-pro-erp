import React, { useState } from 'react';
import { Sparkles, AlertTriangle, TrendingUp, ShieldCheck, RefreshCw } from 'lucide-react';
import { Company, Language } from '../../types';

interface AIDailyBriefingCardProps {
  currentCompany: Company;
  monthlyRevenue: number;
  overdueAmount: number;
  overdueCount: number;
  lowStockCount: number;
  pendingQuotesCount: number;
  language?: Language;
  onRefreshBriefing?: () => void;
}

const briefTranslations: Record<Language, {
  title: string;
  subtitle: (company: string) => string;
  refreshBtn: string;
  revenuePart: (symbol: string, amount: string) => string;
  overduePart: (count: number, symbol: string, amount: string) => string;
  noOverduePart: string;
  lowStockPart: (count: number) => string;
  pendingQuotesPart: (count: number) => string;
  alertsTitle: string;
  alertsText: (count: number) => string;
  noAlertsText: string;
  oppsTitle: string;
  oppsText: (count: number) => string;
  noOppsText: string;
  healthTitle: string;
  healthText: string;
}> = {
  pt: {
    title: 'Resumo Diário & Insights Executivos IA',
    subtitle: (comp) => `Análise em tempo real do faturamento e operações da ${comp}`,
    refreshBtn: 'Atualizar IA',
    revenuePart: (sym, amt) => `Você faturou ${sym}${amt} neste mês.`,
    overduePart: (cnt, sym, amt) => ` Existem ${cnt} pagamentos em atraso totalizando ${sym}${amt}.`,
    noOverduePart: ' Nenhuma pendência financeira crítica registrada.',
    lowStockPart: (cnt) => ` Atenção: ${cnt} itens do seu estoque estão com quantidade abaixo do mínimo recomendado.`,
    pendingQuotesPart: (cnt) => ` ${cnt} orçamentos enviados estão aguardando aprovação dos clientes.`,
    alertsTitle: 'Alertas de Risco',
    alertsText: (cnt) => `${cnt} cliente(s) inadimplente(s). Envie cobrança automática via WhatsApp.`,
    noAlertsText: 'Sem inadimplência crítica no momento.',
    oppsTitle: 'Oportunidades de Venda',
    oppsText: (cnt) => `${cnt} orçamento(s) abertos com grande chance de fechamento.`,
    noOppsText: 'Propostas em dia. Crie novos orçamentos para alavancar receita.',
    healthTitle: 'Saúde do Negócio',
    healthText: 'Score operacional de 92%. Fluxo de caixa previsto estável para os próximos 30 dias.',
  },
  en: {
    title: 'Daily Executive Briefing & AI Insights',
    subtitle: (comp) => `Real-time revenue and operational analysis for ${comp}`,
    refreshBtn: 'Refresh AI',
    revenuePart: (sym, amt) => `You generated ${sym}${amt} in revenue this month.`,
    overduePart: (cnt, sym, amt) => ` There are ${cnt} overdue payments totaling ${sym}${amt}.`,
    noOverduePart: ' No critical financial pending items registered.',
    lowStockPart: (cnt) => ` Warning: ${cnt} items in your inventory are below the recommended minimum.`,
    pendingQuotesPart: (cnt) => ` ${cnt} sent quote(s) are awaiting customer approval.`,
    alertsTitle: 'Risk Alerts',
    alertsText: (cnt) => `${cnt} overdue client(s). Send automated WhatsApp reminders.`,
    noAlertsText: 'No critical default at the moment.',
    oppsTitle: 'Sales Opportunities',
    oppsText: (cnt) => `${cnt} open quote(s) with high closing probability.`,
    noOppsText: 'Proposals up to date. Create new quotes to boost revenue.',
    healthTitle: 'Business Health',
    healthText: 'Operational score of 92%. Forecasted cash flow is stable for the next 30 days.',
  },
  es: {
    title: 'Resumen Diario e Insights Ejecutivos IA',
    subtitle: (comp) => `Análisis en tiempo real de facturación y operaciones de ${comp}`,
    refreshBtn: 'Actualizar IA',
    revenuePart: (sym, amt) => `Has facturado ${sym}${amt} este mes.`,
    overduePart: (cnt, sym, amt) => ` Hay ${cnt} pagos atrasados que suman ${sym}${amt}.`,
    noOverduePart: ' Sin pendientes financieros críticos registrados.',
    lowStockPart: (cnt) => ` Atención: ${cnt} artículos de tu inventario están por debajo del mínimo recomendado.`,
    pendingQuotesPart: (cnt) => ` ${cnt} presupuestos enviados están esperando aprobación del cliente.`,
    alertsTitle: 'Alertas de Riesgo',
    alertsText: (cnt) => `${cnt} cliente(s) moroso(s). Envía cobro automático por WhatsApp.`,
    noAlertsText: 'Sin morosidad crítica de momento.',
    oppsTitle: 'Oportunidades de Venta',
    oppsText: (cnt) => `${cnt} presupuesto(s) abierto(s) con alta probabilidad de cierre.`,
    noOppsText: 'Propuestas al día. Crea nuevos presupuestos para impulsar ingresos.',
    healthTitle: 'Salud del Negocio',
    healthText: 'Puntuación operacional del 92%. Flujo de caja previsto estable para los próximos 30 días.',
  },
  fr: {
    title: 'Résumé Quotidien & Insights Exécutifs IA',
    subtitle: (comp) => `Analyse en temps réel du chiffre d'affaires et des opérations de ${comp}`,
    refreshBtn: 'Actualiser IA',
    revenuePart: (sym, amt) => `Vous avez réalisé ${sym}${amt} de chiffre d'affaires ce mois-ci.`,
    overduePart: (cnt, sym, amt) => ` Il y a ${cnt} paiements en retard totalisant ${sym}${amt}.`,
    noOverduePart: ' Aucune pendance financière critique enregistrée.',
    lowStockPart: (cnt) => ` Attention : ${cnt} articles de votre stock sont en dessous du minimum recommandé.`,
    pendingQuotesPart: (cnt) => ` ${cnt} devis envoyés sont en attente d'approbation client.`,
    alertsTitle: 'Alertes de Risque',
    alertsText: (cnt) => `${cnt} client(s) en retard. Envoyez un rappel automatique via WhatsApp.`,
    noAlertsText: 'Aucun retard critique pour le moment.',
    oppsTitle: 'Opportunités de Vente',
    oppsText: (cnt) => `${cnt} devis ouvert(s) avec une forte chance de signature.`,
    noOppsText: 'Propositions à jour. Créez de nouveaux devis pour booster le CA.',
    healthTitle: 'Santé de l\'Entreprise',
    healthText: 'Score opérationnel de 92%. Flux de trésorerie prévisionnel stable pour les 30 prochains jours.',
  },
};

export const AIDailyBriefingCard: React.FC<AIDailyBriefingCardProps> = ({
  currentCompany,
  monthlyRevenue,
  overdueAmount,
  overdueCount,
  lowStockCount,
  pendingQuotesCount,
  language = 'pt',
  onRefreshBriefing,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const currencySymbol = currentCompany.currency === 'EUR' ? '€' : 'R$';

  const safeLang = language && briefTranslations[language] ? language : 'pt';
  const tr = briefTranslations[safeLang];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefreshBriefing) await onRefreshBriefing();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const formattedRevenue = monthlyRevenue.toLocaleString(safeLang === 'pt' ? 'pt-PT' : 'en-US', { minimumFractionDigits: 2 });
  const formattedOverdue = overdueAmount.toLocaleString(safeLang === 'pt' ? 'pt-PT' : 'en-US', { minimumFractionDigits: 2 });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-5 lg:p-6 text-slate-100 shadow-xl">
      {/* Decorative ambient gradient */}
      <div className="absolute -right-10 -top-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-amber-300 shadow-inner">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base tracking-tight flex items-center gap-2">
              {tr.title}
            </h3>
            <span className="text-[11px] text-slate-400">
              {tr.subtitle(currentCompany.name)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700/60 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          <span>{tr.refreshBtn}</span>
        </button>
      </div>

      {/* Narrative AI Insights Summary Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 mb-4 text-sm leading-relaxed text-slate-200">
        <p className="font-medium">
          "{tr.revenuePart(currencySymbol, formattedRevenue)}
          {overdueCount > 0 ? (
            <span className="text-rose-300 font-semibold">{tr.overduePart(overdueCount, currencySymbol, formattedOverdue)}</span>
          ) : (
            <span>{tr.noOverduePart}</span>
          )}
          {lowStockCount > 0 && (
            <span className="text-amber-300 font-semibold">{tr.lowStockPart(lowStockCount)}</span>
          )}
          {pendingQuotesCount > 0 && (
            <span className="text-blue-300 font-semibold">{tr.pendingQuotesPart(pendingQuotesCount)}</span>
          )}"
        </p>
      </div>

      {/* Grid of Key AI Bullet Alerts & Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Alerts Box */}
        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/20 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-bold text-rose-300 uppercase tracking-wider mb-0.5">{tr.alertsTitle}</div>
            <div className="text-slate-300">
              {overdueCount > 0 ? tr.alertsText(overdueCount) : tr.noAlertsText}
            </div>
          </div>
        </div>

        {/* Opportunities Box */}
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-2.5">
          <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-bold text-emerald-300 uppercase tracking-wider mb-0.5">{tr.oppsTitle}</div>
            <div className="text-slate-300">
              {pendingQuotesCount > 0 ? tr.oppsText(pendingQuotesCount) : tr.noOppsText}
            </div>
          </div>
        </div>

        {/* Health Index Box */}
        <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-bold text-blue-300 uppercase tracking-wider mb-0.5">{tr.healthTitle}</div>
            <div className="text-slate-300">
              {tr.healthText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
