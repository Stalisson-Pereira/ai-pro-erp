import React, { useState } from 'react';
import { FileSearch, Upload, Sparkles, CheckCircle2, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { Company, Language } from '../../types';

interface DocumentAnalyzerProps {
  currentCompany: Company;
  language: Language;
}

export const DocumentAnalyzer: React.FC<DocumentAnalyzerProps> = ({ currentCompany, language }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [documentText, setDocumentText] = useState('');

  const sampleDocText = `FATURA SIMPLIFICADA № FT 2026/1042
Fornecedor: EletroPeças Lda - NIF: 509123456
Endereço: Av. da Liberdade 120, Lisboa
Cliente: ${currentCompany.name} - NIF: ${currentCompany.nif}
Data: 24/07/2026

Item 1: Disjuntor Trifásico Schneider 32A - Qtd: 4 x €45.00 = €180.00
Item 2: Cabo de Cobre Isolado 100m - Qtd: 1 x €120.00 = €120.00
Subtotal: €300.00
IVA 23%: €69.00
TOTAL A PAGAR: €369.00
Vencimento: 10/08/2026`;

  const handleAnalyze = async (docText: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/ai/analyze-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText: docText }),
      });

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error('Error analyzing document:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-indigo-500" />
          Análise Inteligente de Documentos (OCR & IA)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Digitalize e extraia dados automáticos de faturas, recibos e contratos com Inteligência Artificial
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Input Area */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              Conteúdo do Documento
            </h3>

            <button
              onClick={() => {
                setDocumentText(sampleDocText);
                handleAnalyze(sampleDocText);
              }}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Usar Exemplo de Fatura</span>
            </button>
          </div>

          <textarea
            rows={10}
            value={documentText}
            onChange={(e) => setDocumentText(e.target.value)}
            placeholder="Cole o texto do documento ou selecione um exemplo acima..."
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:outline-none focus:border-indigo-500"
          />

          <button
            onClick={() => handleAnalyze(documentText)}
            disabled={isAnalyzing || !documentText.trim()}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analisando com Gemini IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analisar e Extrair Dados</span>
              </>
            )}
          </button>
        </div>

        {/* Right Extracted AI Data Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
            Dados Extraídos pela IA
          </h3>

          {!analysisResult && !isAnalyzing && (
            <div className="py-16 text-center text-slate-400 text-xs">
              Aguardando envio de documento para extração de campos.
            </div>
          )}

          {isAnalyzing && (
            <div className="py-16 text-center text-indigo-500 text-xs space-y-2">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
              <p className="font-semibold">Lendo e estruturando metadados...</p>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <div className="font-bold text-indigo-400 uppercase tracking-wider mb-1">
                  Resumo IA
                </div>
                <div className="text-slate-200 font-medium">{analysisResult.summary}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold">Tipo de Documento</div>
                  <div className="font-extrabold text-slate-900 dark:text-slate-100 uppercase">{analysisResult.documentType}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold">Entidade / Fornecedor</div>
                  <div className="font-extrabold text-slate-900 dark:text-slate-100">{analysisResult.entityName}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold">Valor Total Extraído</div>
                  <div className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {currentCompany.currency === 'EUR' ? '€' : 'R$'}{analysisResult.totalValue}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold">Vencimento</div>
                  <div className="font-extrabold text-slate-900 dark:text-slate-100">{analysisResult.dueDate}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Recomendação: Lançar como despesa de €{analysisResult.totalValue} no centro de custo "Operacional".</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
