import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, MapPin, User, CheckCircle2 } from 'lucide-react';
import { CalendarEvent, Company, Language } from '../../types';
import { translations } from '../../lib/i18n';

interface CalendarViewProps {
  events: CalendarEvent[];
  currentCompany: Company;
  language: Language;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, currentCompany, language }) => {
  const t = translations[language];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Agenda & Visitas Técnicas
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compromissos, reuniões comerciais e serviços agendados no terreno
          </p>
        </div>

        <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Agendar Compromisso</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Timeline */}
        <div className="lg:col-span-2 space-y-3">
          {events.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              Nenhum evento agendado para este mês.
            </div>
          ) : (
            events.map((evt) => (
              <div
                key={evt.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-4 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                    <CalendarIcon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{evt.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          evt.type === 'visita'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {evt.type}
                      </span>
                    </div>

                    {evt.clientName && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-semibold">
                        <User className="w-3.5 h-3.5" />
                        <span>{evt.clientName}</span>
                      </div>
                    )}

                    {evt.location && (
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{evt.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right text-xs shrink-0">
                  <div className="font-extrabold text-slate-900 dark:text-slate-100">{evt.date}</div>
                  <div className="text-slate-400 mt-0.5 font-medium">{evt.time}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Mini Side Summary Box */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 h-fit">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
            Resumo de Compromissos
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Total de Visitas Técnicas:</span>
              <span className="font-bold text-amber-500">2</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Reuniões Comerciais:</span>
              <span className="font-bold text-blue-500">1</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Lembretes Financeiros:</span>
              <span className="font-bold text-emerald-500">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
