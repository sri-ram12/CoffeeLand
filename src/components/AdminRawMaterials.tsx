import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  Search,
  Filter,
  Package,
  Calendar,
  DollarSign,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ShoppingBag,
  Store,
  RefreshCw
} from 'lucide-react';
import { RawMaterialEntry } from '../types/product';
import { api } from '../services/api';
import * as XLSX from 'xlsx';

interface AdminRawMaterialsProps {
  onExportExcel?: () => void;
}

const CATEGORIES = [
  'Coffee & Beverages',
  'Dairy',
  'Bakery',
  'Pantry & Cheese',
  'Poultry & Meat',
  'Packaging',
  'Syrups & Spices',
  'Vegetables & Produce',
  'Other'
] as const;

const UNITS = [
  'kg',
  'g',
  'Liters',
  'ml',
  'Pieces',
  'Portions',
  'Slices',
  'Packets',
  'Boxes',
  'Bags',
  'Units'
] as const;

const DEFAULT_SUGGESTIONS = [
  { name: 'Single-Origin Arabica Coffee Beans', category: 'Coffee & Beverages', unit: 'kg', defaultCost: 1100 },
  { name: 'Fresh Full Cream Milk', category: 'Dairy', unit: 'Liters', defaultCost: 64 },
  { name: 'Fresh Mozzarella Cheese Blend', category: 'Pantry & Cheese', unit: 'kg', defaultCost: 480 },
  { name: 'Gourmet Golden Brioche Buns', category: 'Bakery', unit: 'Pieces', defaultCost: 22 },
  { name: 'Fresh Farm Chicken Fillet', category: 'Poultry & Meat', unit: 'kg', defaultCost: 260 },
  { name: 'Kataifi Shredded Vermicelli (Kunafa)', category: 'Pantry & Cheese', unit: 'kg', defaultCost: 350 },
  { name: 'Lotus Biscoff Spread & Biscuit Base', category: 'Pantry & Cheese', unit: 'kg', defaultCost: 850 },
  { name: 'Artisan Sourdough Sandwich Bread', category: 'Bakery', unit: 'Slices', defaultCost: 8 },
  { name: 'Fine Granulated Cane Sugar', category: 'Syrups & Spices', unit: 'kg', defaultCost: 45 },
  { name: 'Madagascar Vanilla Bean Syrup', category: 'Syrups & Spices', unit: 'Liters', defaultCost: 450 },
  { name: 'Eco Takeaway Coffee Cups & Lids', category: 'Packaging', unit: 'Units', defaultCost: 12 },
  { name: 'Heavy Whipping Cream', category: 'Dairy', unit: 'Liters', defaultCost: 220 },
  { name: 'Salted Dairy Butter (Amul)', category: 'Dairy', unit: 'kg', defaultCost: 520 },
  { name: 'Italian Pizza Sauce & Pelati', category: 'Pantry & Cheese', unit: 'kg', defaultCost: 180 },
  { name: 'French Fries Coated 9mm', category: 'Pantry & Cheese', unit: 'kg', defaultCost: 140 }
];

export const AdminRawMaterials: React.FC<AdminRawMaterialsProps> = () => {
  const todayStr = new Date().toISOString().split('T')[0];

  // List of raw materials
  const [materials, setMaterials] = useState<RawMaterialEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State for Adding / Editing
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<RawMaterialEntry['category']>('Coffee & Beverages');
  const [quantity, setQuantity] = useState<number | ''>(5);
  const [unit, setUnit] = useState<RawMaterialEntry['unit']>('kg');
  const [costRs, setCostRs] = useState<number | ''>(500);
  const [status, setStatus] = useState<RawMaterialEntry['status']>('Required');
  const [supplier, setSupplier] = useState('');
  const [date, setDate] = useState(todayStr);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'Required' | 'Purchased' | 'In Stock'>('all');

  // Delete Confirmation Modal State
  const [deleteModalItem, setDeleteModalItem] = useState<{ id: string; name: string } | null>(null);

  // Quick Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  // Load from backend API with localStorage backup
  useEffect(() => {
    let isMounted = true;
    async function fetchMaterials() {
      setIsLoading(true);
      try {
        const data = await api.getRawMaterials();
        if (isMounted) {
          if (data && data.length > 0) {
            setMaterials(data);
          } else {
            const hasSeeded = localStorage.getItem('coffeeland_raw_materials_seeded');
            if (!hasSeeded) {
              // Pre-seed with default common cafe requirements ONLY on first setup
              const seed: RawMaterialEntry[] = [
                {
                  id: 'raw-seed-1',
                  name: 'Single-Origin Arabica Coffee Beans',
                  category: 'Coffee & Beverages',
                  quantity: 10,
                  unit: 'kg',
                  costRs: 11000,
                  status: 'In Stock',
                  supplier: 'Chikmagalur Coffee Estate',
                  date: todayStr,
                  notes: 'Medium-dark roast for signature espresso'
                },
                {
                  id: 'raw-seed-2',
                  name: 'Fresh Full Cream Milk',
                  category: 'Dairy',
                  quantity: 25,
                  unit: 'Liters',
                  costRs: 1600,
                  status: 'Purchased',
                  supplier: 'Heritage Dairy Sangivalasa',
                  date: todayStr,
                  notes: 'Morning delivery for cappuccinos and shakes'
                },
                {
                  id: 'raw-seed-3',
                  name: 'Fresh Mozzarella Cheese Blend',
                  category: 'Pantry & Cheese',
                  quantity: 8,
                  unit: 'kg',
                  costRs: 3840,
                  status: 'Required',
                  supplier: 'Dairy Wholesaler Vizag',
                  date: todayStr,
                  notes: 'For artisanal wood-fired pizzas'
                },
                {
                  id: 'raw-seed-4',
                  name: 'Gourmet Golden Brioche Buns',
                  category: 'Bakery',
                  quantity: 40,
                  unit: 'Pieces',
                  costRs: 880,
                  status: 'Required',
                  supplier: 'Local Bakery Hub',
                  date: todayStr,
                  notes: 'For specialty chicken and cheese burgers'
                }
              ];
              setMaterials(seed);
              localStorage.setItem('coffeeland_raw_materials_v1', JSON.stringify(seed));
              localStorage.setItem('coffeeland_raw_materials_seeded', 'true');
            } else {
              setMaterials([]);
            }
          }
        }
      } catch (err) {
        console.warn('Could not load raw materials', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchMaterials();
    return () => { isMounted = false; };
  }, [todayStr]);

  // Reset form
  const handleResetForm = () => {
    setIsEditingId(null);
    setName('');
    setCategory('Coffee & Beverages');
    setQuantity(5);
    setUnit('kg');
    setCostRs(500);
    setStatus('Required');
    setSupplier('');
    setDate(todayStr);
    setNotes('');
    setFormError('');
  };

  // Select a suggestion
  const handlePickSuggestion = (sug: typeof DEFAULT_SUGGESTIONS[0]) => {
    setName(sug.name);
    setCategory(sug.category as RawMaterialEntry['category']);
    setUnit(sug.unit as RawMaterialEntry['unit']);
    if (!costRs || costRs === 500) {
      setCostRs(sug.defaultCost);
    }
  };

  // Start editing a material
  const handleStartEdit = (item: RawMaterialEntry) => {
    setIsEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setCostRs(item.costRs);
    setStatus(item.status);
    setSupplier(item.supplier || '');
    setDate(item.date || todayStr);
    setNotes(item.notes || '');
    setFormError('');
    // Scroll to form smoothly
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Submit Add / Edit
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter raw material name');
      return;
    }
    if (quantity === '' || Number(quantity) <= 0) {
      setFormError('Please enter a valid quantity greater than 0');
      return;
    }
    if (costRs === '' || Number(costRs) < 0) {
      setFormError('Please enter a valid amount in Rs (₹)');
      return;
    }

    const payload: Partial<RawMaterialEntry> = {
      name: name.trim(),
      category,
      quantity: Number(quantity),
      unit,
      costRs: Number(costRs),
      status,
      supplier: supplier.trim(),
      date,
      notes: notes.trim()
    };

    if (isEditingId) {
      // Update existing
      setMaterials((prev) =>
        prev.map((m) => (m.id === isEditingId ? ({ ...m, ...payload } as RawMaterialEntry) : m))
      );
      showToast(`Updated "${payload.name}" successfully`);
      handleResetForm();
      await api.updateRawMaterial(isEditingId, payload);
    } else {
      // Create new
      const created = await api.addRawMaterial(payload);
      if (created) {
        setMaterials((prev) => [created, ...prev]);
        showToast(`Added "${created.name}" to inventory`);
        handleResetForm();
      }
    }
  };

  // Trigger Delete Confirmation Modal
  const handleRequestDelete = (id: string, matName: string) => {
    setDeleteModalItem({ id, name: matName });
  };

  // Confirmed Delete Execution
  const handleConfirmDelete = async () => {
    if (!deleteModalItem) return;
    const targetId = deleteModalItem.id;
    const targetName = deleteModalItem.name;
    setDeleteModalItem(null);

    // 1. Instantly remove from local state
    setMaterials((prev) => prev.filter((m) => String(m.id).trim() !== String(targetId).trim()));
    showToast(`✓ Removed "${targetName}" from list`);

    // 2. Persist delete via API and storage
    try {
      await api.deleteRawMaterial(targetId);
    } catch (err) {
      console.warn('API deleteRawMaterial failed, local item deleted', err);
    }
  };

  // Quick toggle status
  const handleToggleStatus = async (item: RawMaterialEntry) => {
    const nextStatus: RawMaterialEntry['status'] =
      item.status === 'Required'
        ? 'Purchased'
        : item.status === 'Purchased'
        ? 'In Stock'
        : 'Required';

    setMaterials((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, status: nextStatus } : m))
    );
    showToast(`Status changed to "${nextStatus}"`);

    await api.updateRawMaterial(item.id, { status: nextStatus });
  };

  // Export to Excel
  const handleExportMaterialsExcel = () => {
    const exportData = filteredMaterials.map((m, idx) => ({
      'S.No': idx + 1,
      'Raw Material Name': m.name,
      'Category': m.category,
      'Quantity': m.quantity,
      'Unit': m.unit,
      'Amount (₹)': m.costRs,
      'Estimated Rate / Unit (₹)': m.quantity > 0 ? Math.round(m.costRs / m.quantity) : 0,
      'Requirement Status': m.status,
      'Supplier / Store': m.supplier || 'Local Market',
      'Entry Date': m.date,
      'Kitchen Notes': m.notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Raw Materials Inventory');

    // Add column widths
    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 32 },
      { wch: 20 },
      { wch: 10 },
      { wch: 10 },
      { wch: 14 },
      { wch: 22 },
      { wch: 20 },
      { wch: 24 },
      { wch: 14 },
      { wch: 30 }
    ];

    XLSX.writeFile(workbook, `CoffeeLand_Raw_Materials_${todayStr}.xlsx`);
  };

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.supplier && m.supplier.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.notes && m.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || m.status === selectedStatus;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [materials, searchQuery, selectedCategory, selectedStatus]);

  // Aggregate Metrics
  const totalCostRs = useMemo(() => {
    return filteredMaterials.reduce((acc, m) => acc + (Number(m.costRs) || 0), 0);
  }, [filteredMaterials]);

  const requiredCount = useMemo(() => {
    return materials.filter((m) => m.status === 'Required').length;
  }, [materials]);

  const requiredCostRs = useMemo(() => {
    return materials
      .filter((m) => m.status === 'Required')
      .reduce((acc, m) => acc + (Number(m.costRs) || 0), 0);
  }, [materials]);

  const purchasedCount = useMemo(() => {
    return materials.filter((m) => m.status === 'Purchased' || m.status === 'In Stock').length;
  }, [materials]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Excel Export */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-espresso-950 mb-1">
            <Layers className="w-5 h-5 text-terracotta" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold">Raw Materials & Kitchen Inventory</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
              Rs (₹) &amp; Quantity Tracker
            </span>
          </div>
          <p className="text-xs sm:text-sm text-coffee-700 leading-relaxed max-w-2xl">
            Enter and manage your cafe's raw material requirements with exact quantity, unit, and expense in Rs (₹). Keep kitchen supplies well-stocked and track daily procurement costs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportMaterialsExcel}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
          title="Download raw materials inventory to Excel (.xlsx)"
        >
          <Download className="w-4 h-4" />
          <span>Export Excel (.xlsx)</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Material Expenses */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-coffee-600">
              Total Recorded Expense
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-sm">
              ₹
            </div>
          </div>
          <div>
            <div className="font-display text-2xl sm:text-3xl font-extrabold text-espresso-950">
              ₹{totalCostRs.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-terracotta font-semibold mt-1">
              Across {filteredMaterials.length} Listed Items
            </div>
          </div>
        </div>

        {/* Required to Buy (Pending) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-red-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-700">
              Required to Buy
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-700">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-2xl sm:text-3xl font-extrabold text-red-700">
              {requiredCount} Items
            </div>
            <div className="text-[11px] text-red-600 font-semibold mt-1">
              Est. Cost Needed: ₹{requiredCostRs.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* In-Stock / Purchased */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-emerald-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Purchased & In-Stock
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-700">
              {purchasedCount} Items
            </div>
            <div className="text-[11px] text-emerald-800 font-semibold mt-1">
              Stock Available in Kitchen
            </div>
          </div>
        </div>

        {/* Categories Count */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-terracotta/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-coffee-600">
              Inventory Categories
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#EDE0CC] flex items-center justify-center text-coffee-900">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-2xl sm:text-3xl font-extrabold text-espresso-950">
              {new Set(materials.map((m) => m.category)).size}
            </div>
            <div className="text-[11px] text-coffee-700 font-semibold mt-1">
              Dairy, Coffee, Bakery, etc.
            </div>
          </div>
        </div>
      </div>

      {/* Main Two Columns: Entry Form + Raw Materials Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Add / Edit Raw Material Entry Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-terracotta/20 shadow-md">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-900/10">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-terracotta" />
                <h4 className="font-serif font-bold text-lg text-espresso-950">
                  {isEditingId ? 'Edit Raw Material' : 'Enter Raw Material Requirement'}
                </h4>
              </div>
              {isEditingId && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-xs font-bold text-coffee-600 hover:text-espresso-950 px-2 py-1 rounded-lg bg-neutral-100"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            {!isEditingId && (
              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-coffee-600 block mb-1.5">
                  ⚡ Quick Suggestions (Click to fill):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {DEFAULT_SUGGESTIONS.slice(0, 8).map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePickSuggestion(sug)}
                      className="px-2 py-1 rounded-lg bg-[#EDE0CC]/50 hover:bg-[#EDE0CC] text-[10px] font-bold text-espresso-900 transition-colors truncate max-w-[200px]"
                    >
                      + {sug.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {formError && (
              <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-3.5">
              {/* Material Name */}
              <div>
                <label className="block text-xs font-bold text-espresso-950 mb-1">
                  Raw Material Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Single-Origin Arabica Coffee Beans"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE0CC]/60 border border-amber-900/15 text-xs font-semibold text-espresso-950 focus:bg-white focus:border-terracotta outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-espresso-950 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RawMaterialEntry['category'])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE0CC]/60 border border-amber-900/15 text-xs font-semibold text-espresso-950 focus:bg-white focus:border-terracotta outline-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity and Unit in Two Columns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-espresso-950 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="e.g. 5"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE0CC]/60 border border-amber-900/15 text-xs font-semibold text-espresso-950 focus:bg-white focus:border-terracotta outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-espresso-950 mb-1">
                    Unit *
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as RawMaterialEntry['unit'])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE0CC]/60 border border-amber-900/15 text-xs font-semibold text-espresso-950 focus:bg-white focus:border-terracotta outline-none cursor-pointer"
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cost in Rs (₹) & Requirement Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-espresso-950 mb-1">
                    Cost in Rs (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-espresso-900">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      placeholder="e.g. 550"
                      value={costRs}
                      onChange={(e) => setCostRs(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full pl-7 pr-3.5 py-2.5 rounded-xl bg-[#EDE0CC]/60 border border-amber-900/15 text-xs font-bold text-espresso-950 focus:bg-white focus:border-terracotta outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-espresso-950 mb-1">
                    Requirement Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as RawMaterialEntry['status'])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE0CC]/60 border border-amber-900/15 text-xs font-bold text-espresso-950 focus:bg-white focus:border-terracotta outline-none cursor-pointer"
                  >
                    <option value="Required">🔴 Required (To Buy)</option>
                    <option value="Purchased">🟡 Purchased Today</option>
                    <option value="In Stock">🟢 In Stock</option>
                  </select>
                </div>
              </div>

              {/* Supplier / Store & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-espresso-950 mb-1">
                    Supplier / Store
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Heritage Dairy"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC]/60 border border-amber-900/15 text-xs font-semibold text-espresso-950 focus:bg-white focus:border-terracotta outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-espresso-950 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#EDE0CC]/60 border border-amber-900/15 text-xs font-semibold text-espresso-950 focus:bg-white focus:border-terracotta outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Kitchen Notes */}
              <div>
                <label className="block text-xs font-bold text-espresso-950 mb-1">
                  Kitchen Notes / Specifications
                </label>
                <input
                  type="text"
                  placeholder="e.g. Needed for evening dinner shift, organic preferred"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#EDE0CC]/60 border border-amber-900/15 text-xs font-semibold text-espresso-950 focus:bg-white focus:border-terracotta outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-espresso-950 hover:bg-black text-amber-300 font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] active:scale-95"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>{isEditingId ? 'Save & Update Raw Material' : 'Save Raw Material Requirement'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (7 cols): Raw Materials Inventory Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-terracotta/20 shadow-xs">
            {/* Search and Category Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
              <div className="relative w-full sm:flex-1">
                <Search className="w-4 h-4 text-coffee-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by material, supplier, or note..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#EDE0CC]/60 border border-amber-900/15 text-xs font-semibold text-espresso-950 focus:bg-white focus:border-terracotta outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#EDE0CC]/60 border border-amber-900/15 text-xs font-bold text-espresso-950 outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#EDE0CC]/60 border border-amber-900/15 text-xs font-bold text-espresso-950 outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="Required">Required Only</option>
                  <option value="Purchased">Purchased</option>
                  <option value="In Stock">In Stock</option>
                </select>
              </div>
            </div>

            {/* Materials Table */}
            {filteredMaterials.length === 0 ? (
              <div className="text-center py-12 text-coffee-500">
                <Package className="w-10 h-10 mx-auto mb-2 opacity-30 text-terracotta" />
                <p className="text-xs font-semibold">No raw materials found matching your search.</p>
                <p className="text-[11px] text-coffee-400 mt-1">
                  Use the entry form on the left to add your first requirement!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#EDE0CC]/60 text-coffee-800 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-2.5 rounded-l-xl">Material Name</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5 text-right">Quantity</th>
                      <th className="p-2.5 text-right">Cost (Rs)</th>
                      <th className="p-2.5 text-center">Status</th>
                      <th className="p-2.5 rounded-r-xl text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-900/10">
                    {filteredMaterials.map((item) => (
                      <tr key={item.id} className="hover:bg-amber-50/50 transition-colors">
                        <td className="p-2.5">
                          <span className="font-bold text-espresso-950 block">{item.name}</span>
                          {item.supplier && (
                            <span className="text-[10px] text-coffee-600 block">
                              Store: {item.supplier}
                            </span>
                          )}
                          {item.notes && (
                            <span className="text-[10px] text-coffee-500 italic block">
                              "{item.notes}"
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md bg-[#EDE0CC]/70 text-coffee-900 text-[10px] font-semibold">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold whitespace-nowrap">
                          <span className="text-espresso-900">
                            {item.quantity} {item.unit}
                          </span>
                        </td>
                        <td className="p-2.5 text-right font-bold whitespace-nowrap">
                          <span className="text-espresso-950 font-display text-sm">
                            ₹{item.costRs}
                          </span>
                          <span className="text-[9px] text-coffee-500 block">
                            (₹{item.quantity > 0 ? Math.round(item.costRs / item.quantity) : 0}/{item.unit})
                          </span>
                        </td>
                        <td className="p-2.5 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shadow-2xs hover:scale-105 ${
                              item.status === 'Required'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : item.status === 'Purchased'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                            title="Click to toggle status (Required -> Purchased -> In Stock)"
                          >
                            {item.status === 'Required'
                              ? '🔴 Required'
                              : item.status === 'Purchased'
                              ? '🟡 Purchased'
                              : '🟢 In Stock'}
                          </button>
                        </td>
                        <td className="p-2.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(item)}
                              className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-coffee-800 transition-colors"
                              title="Edit material quantity & cost"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRequestDelete(item.id, item.name)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 active:scale-90 transition-all cursor-pointer"
                              title="Delete requirement"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation In-App Modal (Never blocked by browser popup blockers) */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-terracotta/20 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center shadow-xs">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-espresso-950 font-display">Delete Raw Material?</h3>
              <p className="text-xs text-coffee-700 mt-1.5 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-espresso-950">"{deleteModalItem.name}"</span>?
                This will remove it permanently from requirements and inventory.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalItem(null)}
                className="flex-1 py-2.5 rounded-xl border border-coffee-200 text-coffee-800 font-bold text-xs hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/25 active:scale-95 transition-all cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-espresso-950 text-white border border-terracotta/40 shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
