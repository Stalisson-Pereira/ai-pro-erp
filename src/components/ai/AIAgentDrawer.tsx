import React, { useState, useRef, useEffect } from 'react';
import {
  X, Send, Sparkles, AlertTriangle, CheckCircle2, Bot, User,
  FileText, Users, DollarSign, FileCheck, ArrowRight, Loader2, RefreshCw
} from 'lucide-react';
import { Company, AIActionResult, Language } from '../../types';
import { translations } from '../../lib/i18n';

interface AIAgentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentCompany: Company;
  language: Language;
  onExecuteConfirmAction: (actionResult: AIActionResult) => void;
  companyMetricsSummary: {
    clientCount: number;
    monthlyRevenue: number;
    overdueAmount: number;
    overdueCount: number;
    lowStockCount: number;
    clientsSample: { name: string; phone: string; stage: string }[];
  };
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionResult?: AIActionResult;
}

export const AIAgentDrawer: React.FC<AIAgentDrawerProps> = ({
  isOpen,
  onClose,
  currentCompany,
  language = 'pt',
  onExecuteConfirmAction,
  companyMetricsSummary,
}) => {
  const t = translations[language] || translations.pt;

  const welcomeMessages: Record<Language, string> = {
    pt: `Olá! Sou o seu **Agente Virtual ERP AI PRO**. Como posso ajudar a sua empresa hoje?\n\nPosso **criar orçamentos, cadastrar clientes, gerar contratos, registrar receitas/despesas, enviar mensagens por WhatsApp** ou **analisar inadimplência**.`,
    en: `Hello! I am your **ERP AI PRO Virtual Agent**. How can I help your company today?\n\nI can **create quotes, register clients, generate contracts, log income/expenses, send WhatsApp messages** or **analyze overdue payments**.`,
    es: `¡Hola! Soy tu **Agente Virtual ERP AI PRO**. ¿Cómo puedo ayudar a tu empresa hoy?\n\nPuedo **crear presupuestos, registrar clientes, generar contratos, registrar ingresos/gastos, enviar mensajes por WhatsApp** o **analizar morosidad**.`,
    fr: `Bonjour ! Je suis votre **Agent Virtuel ERP AI PRO**. Comment puis-je aider votre entreprise aujourd'hui ?\n\nJe peux **créer des devis, enregistrer des clients, générer des contrats, enregistrer des revenus/dépenses, envoyer des messages WhatsApp** ou **analyser les retards de paiement**.`,
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: welcomeMessages[language] || welcomeMessages.pt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Sync welcome message if language changes and message list has only welcome
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'msg_welcome') {
        return [
          {
            id: 'msg_welcome',
            sender: 'ai',
            text: welcomeMessages[language] || welcomeMessages.pt,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      }
      return prev;
    });
  }, [language]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const quickPromptsByLang: Record<Language, string[]> = {
    pt: [
      'Crie um orçamento para João no valor de €850',
      'Quem está me devendo pagamentos?',
      'Cadastre cliente Maria Santos NIF 298765432',
      'Gere contrato de manutenção de €5.400',
      'Resuma o fluxo de caixa do mês',
    ],
    en: [
      'Create a quote for John for €850',
      'Who owes me payments?',
      'Register client Mary Smith Tax ID 298765432',
      'Generate maintenance contract for €5,400',
      'Summarize cash flow for the month',
    ],
    es: [
      'Crea un presupuesto para Juan por €850',
      '¿Quién me debe pagos?',
      'Registra cliente María Santos NIF 298765432',
      'Genera contrato de mantenimiento de €5.400',
      'Resume el flujo de caja del mes',
    ],
    fr: [
      'Créer un devis pour Jean d\'un montant de 850 €',
      'Qui me doit des paiements ?',
      'Enregistrer le client Marie Santos NIF 298765432',
      'Générer un contrat de maintenance de 5 400 €',
      'Résumer le flux de trésorerie du mois',
    ],
  };

  const quickPrompts = quickPromptsByLang[language] || quickPromptsByLang.pt;

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = textToSend || inputValue;
    if (!promptText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          language,
          companyData: {
            companyName: currentCompany.name,
            currency: currentCompany.currency,
            clientCount: companyMetricsSummary.clientCount,
            monthlyRevenue: companyMetricsSummary.monthlyRevenue,
            overdueAmount: companyMetricsSummary.overdueAmount,
            overdueCount: companyMetricsSummary.overdueCount,
            lowStockCount: companyMetricsSummary.lowStockCount,
            clientsSample: companyMetricsSummary.clientsSample,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na comunicação com a API do Agente de IA');
      }

      const aiData: AIActionResult = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiData.message || 'Processamento concluído.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionResult: aiData,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      console.error('Error in AI Drawer:', error);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text: `⚠️ Ops! Tivemos um imprevisto ao processar o seu pedido: ${error.message || 'Tente novamente.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAction = (msgId: string, actionResult: AIActionResult) => {
    onExecuteConfirmAction(actionResult);

    // Update message to reflect confirmed action
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.actionResult
          ? {
              ...m,
              actionResult: {
                ...m.actionResult,
                requiresConfirmation: false,
              },
              text: `${m.text}\n\n✅ **Ação confirmada e executada com sucesso no sistema!**`,
            }
          : m
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative z-10 w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base tracking-tight flex items-center gap-2">
                Agente Virtual de IA
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Executável
                </span>
              </h2>
              <p className="text-xs text-slate-400">Pronto para criar cadastros, orçamentos e gerenciar empresas</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Conversation Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-800/80 border border-slate-700/80 text-slate-200 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Confirmation Card if Action Requires Approval */}
                {msg.actionResult?.requiresConfirmation && msg.actionResult.confirmationDetails && (
                  <div className="mt-3.5 p-3 rounded-xl bg-slate-900 border border-indigo-500/40 shadow-inner">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Confirmação Solicitada de Ação</span>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 mb-3">
                      <div><strong className="text-slate-400">Operação:</strong> {msg.actionResult.confirmationDetails.actionType}</div>
                      <div><strong className="text-slate-400">Descrição:</strong> {msg.actionResult.confirmationDetails.description}</div>
                      <div><strong className="text-slate-400">Alvo:</strong> {msg.actionResult.confirmationDetails.targetName}</div>
                    </div>

                    <button
                      onClick={() => handleConfirmAction(msg.id, msg.actionResult!)}
                      className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirmar e Executar no Sistema</span>
                    </button>
                  </div>
                )}

                <div className={`text-[10px] mt-1.5 text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 text-white">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-slate-400 text-xs py-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>O Agente Virtual está processando sua solicitação...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Suggestions */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/40">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Sugestões Rápidas:
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700/60 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Composer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite um comando para a IA executar..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
