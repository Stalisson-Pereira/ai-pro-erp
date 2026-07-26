import { Quote, Contract, FinancialTransaction, Company } from '../types';

export function formatPhoneForWhatsApp(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

export function generateQuoteWhatsAppUrl(quote: Quote, company: Company): string {
  const cleanPhone = formatPhoneForWhatsApp(quote.clientPhone);
  const currencySymbol = company.currency === 'EUR' ? '€' : 'R$';
  
  const text = `Olá, *${quote.clientName}*! 👋\n\n` +
    `Aqui é da empresa *${company.name}*.\n\n` +
    `Segue o seu orçamento *${quote.number}* no valor total de *${currencySymbol}${quote.total.toFixed(2)}*.\n\n` +
    `📋 *Resumo dos itens:*\n` +
    quote.items.map(i => `• ${i.description} (x${i.quantity})`).join('\n') + `\n\n` +
    `📅 *Validade:* ${quote.dueDate}\n` +
    `Qualquer dúvida ou para confirmar o aceite, basta responder esta mensagem!\n\n` +
    `Atenciosamente,\n*${company.name}*`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function generatePaymentReminderWhatsAppUrl(transaction: FinancialTransaction, company: Company): string {
  const cleanPhone = formatPhoneForWhatsApp('351919887766'); // default if client phone missing
  const currencySymbol = company.currency === 'EUR' ? '€' : 'R$';

  const text = `Olá, *${transaction.clientName || 'Cliente'}*! 👋\n\n` +
    `Esperamos que esteja bem. Notamos em nosso sistema que o pagamento referente a *"${transaction.description}"* no valor de *${currencySymbol}${transaction.amount.toFixed(2)}* com vencimento em *${transaction.dueDate}* consta pendente.\n\n` +
    `Caso precise de uma segunda via de boleto, dados para transferência ou chave PIX, estamos à disposição para ajudar!\n\n` +
    `Atenciosamente,\nFinanceiro - *${company.name}*`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function generateContractWhatsAppUrl(contract: Contract, company: Company): string {
  const cleanPhone = formatPhoneForWhatsApp('351919887766');
  const currencySymbol = company.currency === 'EUR' ? '€' : 'R$';

  const text = `Olá, *${contract.clientName}*! 📄\n\n` +
    `O seu contrato *${contract.number}* (*${contract.title}*) no valor de *${currencySymbol}${contract.value.toFixed(2)}* já está disponível para validação.\n\n` +
    `Por favor, confirme o recebimento para darmos início às atividades.\n\n` +
    `Atenciosamente,\n*${company.name}*`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
