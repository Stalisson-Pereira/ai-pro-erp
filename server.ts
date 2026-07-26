import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini API client on server side only
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "ERP AI PRO Backend API" });
});

// AI Executable Virtual Agent API Endpoint
app.post("/api/ai/agent", async (req, res) => {
  try {
    const { prompt, language = "pt", companyData } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `
Você é o Agente de Inteligência Artificial Virtual do ERP AI PRO.
Sua missão é atuar como um funcionário virtual extremamente competente para pequenas e médias empresas.
Você é capaz de interpretar comandos em linguagem natural (Português, Inglês, Espanhol, Francês) e transformar em ações reais no sistema.

DADOS ATUAIS DA EMPRESA PARA CONTEXTO REAL:
- Empresa: ${companyData?.companyName || "Minha Empresa"}
- Total de Clientes: ${companyData?.clientCount || 0}
- Receita Mensal Atual: €${companyData?.monthlyRevenue || 0}
- Pagamentos Atrasados: €${companyData?.overdueAmount || 0} (${companyData?.overdueCount || 0} títulos)
- Itens em Estoque Baixo: ${companyData?.lowStockCount || 0}
- Clientes Cadastrados: ${JSON.stringify(companyData?.clientsSample || [])}

DIRETRIZES RÍGIDAS:
1. NUNCA invente dados fictícios quando perguntado sobre finanças ou clientes da empresa. Use o contexto fornecido.
2. Identifique se a mensagem do usuário solicita uma AÇÃO EXECUTÁVEL (Ex: criar cliente, criar orçamento, gerar contrato, registrar despesa, consultar devoluções/devedores).
3. Se for uma ação executável, retorne a estrutura JSON com o campo "action" preenchido apropriadamente e os campos de dados necessários ("dataCreated").
4. Se a ação envolver criação de cliente, orçamento ou transação, marque "requiresConfirmation": true e forneça os detalhes para o usuário clicar em "Confirmar Ação".
5. Seja educado, profissional, direto e acionável.

Ações possíveis ("action"):
- "CREATE_QUOTE": Criar orçamento/proposta
- "CREATE_CLIENT": Cadastrar novo cliente
- "GENERATE_CONTRACT": Gerar minuta de contrato
- "RECORD_TRANSACTION": Registrar receita ou despesa financeira
- "SEND_WHATSAPP": Gerar mensagem de cobrança ou envio
- "DAILY_SUMMARY": Resumo financeiro/operacional
- "GENERAL_QUERY": Responder dúvidas sobre o sistema ou finanças da empresa

Responda SEMPRE em formato JSON válido contendo:
{
  "action": "ACTION_TYPE",
  "message": "Sua resposta explicativa em linguagem clara para o usuário",
  "dataCreated": { ...objeto com os campos extraídos se for criação... },
  "requiresConfirmation": true ou false,
  "confirmationDetails": {
    "actionType": "Tipo de Ação",
    "description": "Breve descrição da ação que será executada no banco de dados",
    "targetName": "Nome do alvo ou cliente"
  }
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch (e) {
      parsedResult = {
        action: "GENERAL_QUERY",
        message: responseText,
        requiresConfirmation: false,
      };
    }

    res.json(parsedResult);
  } catch (error: any) {
    console.error("Error in /api/ai/agent:", error);
    res.status(500).json({
      error: "Falha na execução do Agente de IA",
      message: error.message || "Verifique a chave de API ou tente novamente.",
    });
  }
});

// Document OCR & Analyzer Endpoint
app.post("/api/ai/analyze-document", async (req, res) => {
  try {
    const { documentText, imageBase64, mimeType = "image/png" } = req.body;

    const ai = getGeminiClient();

    let contents: any = [];

    if (imageBase64) {
      contents = [
        {
          inlineData: {
            mimeType,
            data: imageBase64,
          },
        },
        {
          text: "Analise esta imagem de fatura/recibo/documento e extraia todas as informações financeiras relevantes.",
        },
      ];
    } else {
      contents = [
        `Analise o texto do documento a seguir e extraia os dados estruturados de fatura/recibo:\n\n${documentText}`,
      ];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction: "Extraia os dados de fatura/recibo/documento no formato JSON exato: supplier (fornecedor/empresa), nif (NIF/CNPJ), totalAmount (valor total numérico), date (YYYY-MM-DD), itemsSummary (resumo das mercadorias/serviços), category (categoria financeira sugerida, ex: Fornecedores, TI, Aluguel, Serviços), confidenceScore (0 a 1).",
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    const data = JSON.parse(responseText);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error in /api/ai/analyze-document:", error);
    res.status(500).json({ error: "Erro ao analisar documento com IA", details: error.message });
  }
});

// Daily AI Executive Briefing Endpoint
app.post("/api/ai/daily-briefing", async (req, res) => {
  try {
    const { companyMetrics } = req.body;

    const ai = getGeminiClient();

    const prompt = `Gere um briefing executivo diário e recomendações estratégicas para a empresa com base nestas métricas:
${JSON.stringify(companyMetrics)}

Forneça um texto motivador e acionável com:
1. Resumo do faturamento e resultado
2. Alertas críticos (ex: pagamentos em atraso, estoque baixo)
3. Oportunidades de vendas (ex: negociações e propostas abertas)
4. Previsão rápida do fluxo de caixa`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "Retorne um JSON com os campos: summaryText (texto principal), alerts (array de strings com alertas), opportunities (array de strings com oportunidades), riskAnalysis (texto curto de riscos financeiros).",
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/ai/daily-briefing:", error);
    res.status(500).json({ error: "Erro ao gerar briefing diário", details: error.message });
  }
});

// Vite middleware and static serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ERP AI PRO] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
