import React, { useState } from 'react';
import { X, Package, Save } from 'lucide-react';
import { ProductItem, Company } from '../../types';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (productData: Partial<ProductItem>) => void;
  productToEdit?: ProductItem | null;
  currentCompany: Company;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  onSaveProduct,
  productToEdit,
  currentCompany,
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<'produto' | 'servico'>(productToEdit?.type || 'produto');
  const [sku, setSku] = useState(productToEdit?.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [name, setName] = useState(productToEdit?.name || '');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [category, setCategory] = useState(productToEdit?.category || 'Geral');
  const [price, setPrice] = useState<number>(productToEdit?.price || 150);
  const [cost, setCost] = useState<number>(productToEdit?.cost || 80);
  const [quantity, setQuantity] = useState<number>(productToEdit?.quantity || 25);
  const [minQuantity, setMinQuantity] = useState<number>(productToEdit?.minQuantity || 5);
  const [unit, setUnit] = useState(productToEdit?.unit || 'unid');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveProduct({
      id: productToEdit?.id,
      companyId: currentCompany.id,
      type,
      sku,
      name,
      description,
      category,
      price: Number(price) || 0,
      cost: Number(cost) || 0,
      quantity: Number(quantity) || 0,
      minQuantity: Number(minQuantity) || 0,
      unit,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-500" />
            {productToEdit ? 'Editar Item do Estoque' : 'Cadastrar Produto / Serviço'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Tipo de Item */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
            <button
              type="button"
              onClick={() => setType('produto')}
              className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                type === 'produto' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Produto Físico
            </button>
            <button
              type="button"
              onClick={() => setType('servico')}
              className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                type === 'servico' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Serviço
            </button>
          </div>

          {/* SKU & Nome */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">SKU / Código</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1">Nome do Item *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Sensor de Pressão HD-200"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Categoria & Unidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Categoria</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Eletrônicos, Peças..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Unidade de Medida</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="unid, hora, kg, m2"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Preços */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Preço de Venda ({currentCompany.currency})</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Custo de Aquisição ({currentCompany.currency})</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Quantidades para Produto Físico */}
          {type === 'produto' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Estoque Atual</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Estoque Mínimo (Alerta)</label>
                <input
                  type="number"
                  value={minQuantity}
                  onChange={(e) => setMinQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Descrição */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Descrição do Item</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes técnicos ou especificação do serviço..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Item</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
