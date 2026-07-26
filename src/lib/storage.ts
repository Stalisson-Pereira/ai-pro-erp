import {
  Company, User, Client, Quote, Contract, FinancialTransaction, ProductItem, CalendarEvent, AuditLog
} from '../types';
import {
  initialCompanies, initialClients,
  initialQuotes, initialContracts, initialTransactions, initialInventory,
  initialCalendarEvents, initialAuditLogs
} from '../data/initialData';

const STORAGE_PREFIX = 'erp_ai_pro_';

export function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(defaultValue) && !Array.isArray(parsed)) {
        return defaultValue;
      }
      return parsed ?? defaultValue;
    }
  } catch (e) {
    console.error(`Failed to load ${key} from storage`, e);
  }
  return defaultValue;
}

export function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to storage`, e);
  }
}
