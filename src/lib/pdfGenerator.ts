import { Quote, Contract, Company } from '../types';

export function generateQuotePDF(quote: Quote, company: Company) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const itemsHtml = quote.items.map((item, index) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px; font-size: 13px; text-align: center;">${index + 1}</td>
      <td style="padding: 10px; font-size: 13px;">${item.description}</td>
      <td style="padding: 10px; font-size: 13px; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; font-size: 13px; text-align: right;">${company.currency === 'EUR' ? '€' : 'R$'}${item.unitPrice.toFixed(2)}</td>
      <td style="padding: 10px; font-size: 13px; text-align: right; font-weight: bold;">${company.currency === 'EUR' ? '€' : 'R$'}${item.totalPrice.toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Orçamento ${quote.number} - ${quote.clientName}</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; margin: 0; padding: 40px; background: #fff; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
        .company-name { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
        .company-details { font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 5px; }
        .quote-title { font-size: 26px; font-weight: 800; color: #2563eb; text-align: right; margin: 0; }
        .quote-number { font-size: 14px; font-weight: 600; color: #64748b; text-align: right; margin-top: 4px; }
        .info-grid { display: flex; justify-content: space-between; margin-bottom: 30px; gap: 20px; }
        .info-box { flex: 1; background: #f8fafc; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; }
        .info-box h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin: 0 0 8px 0; }
        .info-box p { font-size: 13px; margin: 2px 0; font-weight: 500; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #0f172a; color: #fff; padding: 12px; font-size: 12px; text-transform: uppercase; text-align: left; }
        .totals { width: 300px; margin-left: auto; margin-bottom: 30px; }
        .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #475569; }
        .totals-row.grand { font-size: 18px; font-weight: 800; color: #0f172a; border-top: 2px solid #0f172a; padding-top: 10px; margin-top: 6px; }
        .footer-terms { background: #f1f5f9; border-radius: 8px; padding: 16px; font-size: 12px; color: #475569; line-height: 1.6; margin-top: 40px; }
        .signature-box { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; }
        .signature-line { width: 220px; border-top: 1px solid #0f172a; text-align: center; font-size: 12px; padding-top: 6px; color: #475569; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="company-name">${company.name}</h1>
          <div class="company-details">
            NIF/CNPJ: ${company.nif} | ${company.email}<br/>
            ${company.phone} | ${company.address}, ${company.city} - ${company.country}
          </div>
        </div>
        <div>
          <h2 class="quote-title">ORÇAMENTO</h2>
          <div class="quote-number">${quote.number}</div>
          <div style="font-size: 12px; color: #64748b; text-align: right; margin-top: 6px;">Data: ${quote.date} | Validade: ${quote.dueDate}</div>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-box">
          <h3>Cliente / Contratante</h3>
          <p style="font-size: 15px; font-weight: bold; color: #0f172a;">${quote.clientName}</p>
          <p>NIF/CPF: ${quote.clientNif || 'N/A'}</p>
          <p>Email: ${quote.clientEmail}</p>
          <p>WhatsApp: ${quote.clientPhone}</p>
        </div>
        <div class="info-box">
          <h3>Condições de Pagamento</h3>
          <p>${quote.terms || 'A combinar / Transferência Bancária / PIX'}</p>
          <p style="margin-top: 8px;"><strong>Garantia:</strong> ${quote.warranty || '90 dias para defeitos de instalação'}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">#</th>
            <th>Descrição do Produto / Serviço</th>
            <th style="width: 70px; text-align: center;">Qtd</th>
            <th style="width: 110px; text-align: right;">P. Unitário</th>
            <th style="width: 120px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="totals">
        <div class="totals-row">
          <span>Subtotal:</span>
          <span>${company.currency === 'EUR' ? '€' : 'R$'}${quote.subtotal.toFixed(2)}</span>
        </div>
        ${quote.discount > 0 ? `
        <div class="totals-row" style="color: #16a34a;">
          <span>Desconto Concedido:</span>
          <span>-${company.currency === 'EUR' ? '€' : 'R$'}${quote.discount.toFixed(2)}</span>
        </div>` : ''}
        <div class="totals-row">
          <span>Impostos Estimados (IVA/Taxa):</span>
          <span>${company.currency === 'EUR' ? '€' : 'R$'}${quote.taxTotal.toFixed(2)}</span>
        </div>
        <div class="totals-row grand">
          <span>Total Geral:</span>
          <span>${company.currency === 'EUR' ? '€' : 'R$'}${quote.total.toFixed(2)}</span>
        </div>
      </div>

      ${quote.notes ? `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 13px; margin: 0 0 6px 0; color: #0f172a;">Observações:</h4>
        <p style="font-size: 12px; color: #475569; margin: 0;">${quote.notes}</p>
      </div>` : ''}

      <div class="footer-terms">
        <strong>Termos do Orçamento:</strong> Os preços indicados neste documento são válidos até ${quote.dueDate}.
        Para aceitação, assine este documento abaixo ou confirme o aceite via resposta de mensagem oficial ou e-mail.
      </div>

      <div class="signature-box">
        <div class="signature-line">
          ${company.name}<br/>
          (Prestador)
        </div>
        <div class="signature-line">
          ${quote.signatureUrl ? `<img src="${quote.signatureUrl}" style="height: 35px; margin-bottom: -10px;" /><br/>` : ''}
          ${quote.clientName}<br/>
          (Cliente - Aceite Digital)
        </div>
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

export function generateContractPDF(contract: Contract, company: Company) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const clausesHtml = contract.clauses.map((clause, idx) => `
    <div style="margin-bottom: 16px; font-size: 13px; line-height: 1.6; color: #1e293b; text-align: justify;">
      ${clause}
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Contrato ${contract.number} - ${contract.clientName}</title>
      <style>
        body { font-family: 'Times New Roman', Times, serif; color: #0f172a; margin: 0; padding: 50px; background: #fff; }
        .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
        .title { font-size: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .subtitle { font-size: 13px; color: #475569; font-family: sans-serif; }
        .parties { background: #f8fafc; border: 1px solid #cbd5e1; padding: 20px; border-radius: 6px; font-family: sans-serif; font-size: 13px; line-height: 1.6; margin-bottom: 30px; }
        .clauses-header { font-family: sans-serif; font-size: 14px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 16px; color: #2563eb; }
        .signatures { margin-top: 60px; display: flex; justify-content: space-around; font-family: sans-serif; font-size: 12px; }
        .sig-block { text-align: center; width: 220px; }
        .sig-line { border-top: 1px solid #0f172a; margin-top: 40px; padding-top: 8px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">CONTRATO DE ${contract.type.replace('_', ' ').toUpperCase()}</div>
        <div class="subtitle">INSTRUMENTO PARTICULAR DE CONTRATAÇÃO Nº ${contract.number}</div>
      </div>

      <div class="parties">
        <strong>CONTRATANTE:</strong> ${company.name}, NIF/CNPJ nº ${company.nif}, com sede em ${company.address}, ${company.city}, ${company.country}.<br/><br/>
        <strong>CONTRATADO:</strong> ${contract.clientName}, NIF/CPF nº ${contract.clientNif || 'N/A'}.<br/><br/>
        <strong>OBJETO:</strong> ${contract.title}. Valor total contratado de ${company.currency === 'EUR' ? '€' : 'R$'}${contract.value.toFixed(2)} com vigência de ${contract.startDate} até ${contract.endDate}.
      </div>

      <div class="clauses-header">CLÁUSULAS CONTRATUAIS</div>

      ${clausesHtml}

      <div style="margin-top: 40px; font-family: sans-serif; font-size: 12px; color: #475569; text-align: right;">
        Local e data: ${company.city}, ${new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
      </div>

      <div class="signatures">
        <div class="sig-block">
          <div class="sig-line">
            <strong>${company.name}</strong><br/>
            Contratante
          </div>
        </div>
        <div class="sig-block">
          <div class="sig-line">
            <strong>${contract.clientName}</strong><br/>
            Contratado ${contract.signedAtClient ? '(Assinado Digitalmente)' : ''}
          </div>
        </div>
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
