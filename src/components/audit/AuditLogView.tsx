import React from 'react';
import { ShieldCheck, Lock, UserCheck, Clock } from 'lucide-react';
import { AuditLog, Company } from '../../types';

interface AuditLogViewProps {
  logs: AuditLog[];
  currentCompany: Company;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs, currentCompany }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          Trilha de Auditoria & Segurança de Dados
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Registro imutável de todas as ações de usuários, orçamentos emitidos e execuções do Agente de IA
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                <th className="py-3 px-4">Data / Hora</th>
                <th className="py-3 px-4">Usuário / Ator</th>
                <th className="py-3 px-4">Ação Realizada</th>
                <th className="py-3 px-4">Módulo</th>
                <th className="py-3 px-4">IP / Origem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500">{log.timestamp}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">{log.userName}</td>
                  <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{log.action}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-[10px] uppercase">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{log.ipAddress || '127.0.0.1'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
