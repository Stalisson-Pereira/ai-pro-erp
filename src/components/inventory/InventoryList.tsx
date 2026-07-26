import React, { useState } from 'react';
import {
  Package, Plus, Search, AlertTriangle, Edit, Trash2, Tag, CheckCircle2
} from 'lucide-react';
import { ProductItem, Company, Language } from '../../types';
import { translations } from '../../lib/i18n';

interface InventoryListProps {
  inventory: ProductItem[];
  currentCompany: Company;
  language: Language;
  onOpenNewProductModal: () => void;
  onEditProduct: (product: ProductItem) => void;
  onDeleteProduct: (productId: string) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({
  inventory,
  currentCompany,
  language,
  onOpenNewProductModal,
  onEditProduct,
  onDeleteProduct,
}) => {
  const t = translations[language];
  const currencySymbol = currentCompany.currency === 'EUR' ? '€' : 'R$';
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'todos' | 'produto' | 'servico'>('todos');

  const lowStockItems = inventory.filter((i) => i.quantity <= i.minQuantity);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'todos' ? true : item.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Catálogo de Produtos, Serviços & Estoque
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Controle de SKU, quantidade mínima, preços de venda e alertas automáticos de reabastecimento
          </p>
        </div>

        <button
          onClick={onOpenNewProductModal}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Item</span>
        </button>
      </div>

      {/* Low Stock Banner Alert */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div className="text-xs font-semibold">
              <strong className="font-extrabold">{lowStockItems.length} itens do estoque</strong> estão com quantidade abaixo do limite mínimo configurado!
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por Nome do item, SKU ou Categoria..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
            <button
              onClick={() => setTypeFilter('todos')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${typeFilter === 'todos' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setTypeFilter('produto')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${typeFilter === 'produto' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'}`}
            >
              Produtos
            </button>
            <button
              onClick={() => setTypeFilter('servico')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${typeFilter === 'servico' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-500'}`}
            >
              Serviços
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            Nenhum produto ou serviço encontrado.
          </div>
        ) : (
          filteredInventory.map((item) => {
            const isLowStock = item.type === 'produto' && item.quantity <= item.minQuantity;

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SKU: {item.sku}</span>
                      <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">{item.name}</h3>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        item.type === 'produto'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-xs mb-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div>
                      <div className="text-[10px] text-slate-400">Preço Venda</div>
                      <div className="font-black text-sm text-slate-900 dark:text-slate-100">
                        {currencySymbol}{item.price.toFixed(2)}
                      </div>
                    </div>

                    {item.type === 'produto' && (
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">Qtd em Estoque</div>
                        <div className={`font-black text-sm ${isLowStock ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {item.quantity} {item.unit || 'unid'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">{item.category}</span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditProduct(item)}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Editar Item"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteProduct(item.id)}
                      className="p-2 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Excluir Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
