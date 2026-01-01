import React, { useState, useMemo } from "react";
import { useBudgets } from "../context/BudgetContext";
import { useTransactionsContext } from "../context/TransactionsContext";
import { useCurrency } from "../context/CurrencyContext";
import { useCategories } from "../context/CategoriesContext";
import { useNotifications } from "../context/NotificationsContext";
import { Card } from "../components/Card";
import { CategoryIcon } from "../components/CategoryIcon";
import { 
  Target, 
  Plus, 
  Lightbulb, 
  Wallet,
  ChevronDown
} from "lucide-react";

type BudgetPeriod = "weekly" | "monthly" | "yearly";

interface BudgetItem {
  categoryId: string;
  limit: number;
  period: BudgetPeriod;
}

const BudgetsPage: React.FC = () => {
  const { budgets, setOverallBudget, setCategoryBudget } = useBudgets();
  const { transactions } = useTransactionsContext();
  const { formatAmount, symbol } = useCurrency();
  const { categories } = useCategories();
  const { addNotification } = useNotifications();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [budgetPeriod, setBudgetPeriod] = useState<BudgetPeriod>("monthly");

  // Calculate current period spending
  const currentSpending = useMemo(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    
    // Get start of current week (Sunday)
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const totals: Record<string, { monthly: number; weekly: number }> = {};
    
    // Initialize all categories
    categories.forEach(cat => {
      totals[cat.id] = { monthly: 0, weekly: 0 };
    });
    totals["overall"] = { monthly: 0, weekly: 0 };
    
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const txDate = new Date(t.date + "T00:00:00");
        
        // Monthly
        if (t.date.startsWith(currentMonth)) {
          totals["overall"].monthly += t.amount;
          if (totals[t.category]) {
            totals[t.category].monthly += t.amount;
          }
        }
        
        // Weekly
        if (txDate >= weekStart) {
          totals["overall"].weekly += t.amount;
          if (totals[t.category]) {
            totals[t.category].weekly += t.amount;
          }
        }
      });
    
    return totals;
  }, [transactions, categories]);

  const hasBudgets = budgets.overall !== null || 
    Object.values(budgets.perCategory).some((v) => v !== null);

  const handleCreateBudget = () => {
    const amount = parseFloat(budgetLimit);
    if (isNaN(amount) || amount <= 0 || !selectedCategory) return;

    if (selectedCategory === "overall") {
      setOverallBudget(amount);
    } else {
      setCategoryBudget(selectedCategory, amount);
    }

    // Check if already over budget
    const spending = currentSpending[selectedCategory];
    const spent = budgetPeriod === "monthly" ? spending?.monthly ?? 0 : spending?.weekly ?? 0;
    
    if (spent > amount) {
      addNotification({
        type: "budget_exceeded",
        title: "Budget Exceeded",
        message: `You've already exceeded your ${selectedCategory === "overall" ? "overall" : categories.find(c => c.id === selectedCategory)?.name} budget.`
      });
    } else if (spent >= amount * 0.8) {
      addNotification({
        type: "budget_warning",
        title: "Budget Warning",
        message: `You're close to your ${selectedCategory === "overall" ? "overall" : categories.find(c => c.id === selectedCategory)?.name} budget limit.`
      });
    }

    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory("");
    setBudgetLimit("");
    setBudgetPeriod("monthly");
  };

  const openCreateModal = () => {
    setSelectedCategory("");
    setBudgetLimit("");
    setBudgetPeriod("monthly");
    setShowModal(true);
  };

  const openEditModal = (categoryId: string, currentLimit: number | null) => {
    setSelectedCategory(categoryId);
    setBudgetLimit(currentLimit?.toString() ?? "");
    setBudgetPeriod("monthly");
    setShowModal(true);
  };

  const getProgressColor = (spent: number, limit: number) => {
    const percent = (spent / limit) * 100;
    if (percent >= 100) return "bg-red-500";
    if (percent >= 80) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getProgressPercent = (spent: number, limit: number) => {
    return Math.min((spent / limit) * 100, 100);
  };

  const getStatusText = (spent: number, limit: number) => {
    const percent = (spent / limit) * 100;
    if (percent >= 100) return { text: "Over budget!", color: "text-red-500" };
    if (percent >= 80) return { text: "Near limit", color: "text-amber-500" };
    return { text: "On track", color: "text-emerald-500" };
  };

  // Filter categories that have budgets set
  const budgetedCategories = categories.filter(
    cat => budgets.perCategory[cat.id] !== null && budgets.perCategory[cat.id] !== undefined
  );

  // Content - Empty state or filled
  const content = !hasBudgets ? (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">
          Budgets
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Budget Planner – Set and track your spending limits by category
        </p>
      </div>

      <Card className="text-center py-16">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-[var(--bg-secondary)] flex items-center justify-center text-slate-400">
            <Target size={32} />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
          No budgets created yet
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
          Create your first budget to start tracking your spending
        </p>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-900 text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          <span>Create Your First Budget</span>
        </button>
      </Card>

      <Card>
        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-50 mb-3 flex items-center gap-2">
          <Lightbulb size={16} className="text-amber-500" />
          <span>Budget Tips</span>
        </h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <li>• Start with essential categories like Housing, Groceries, and Transportation</li>
          <li>• Set realistic limits based on your past spending</li>
          <li>• You'll get notifications when approaching or exceeding limits</li>
          <li>• Review and adjust your budgets monthly</li>
        </ul>
      </Card>
    </div>
  ) : (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">
            Budgets
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Track your spending limits
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-900 text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          <span>Add Budget</span>
        </button>
      </div>

      {budgets.overall !== null && (
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                <Wallet size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  Overall Monthly Budget
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {formatAmount(currentSpending["overall"]?.monthly ?? 0)} of {formatAmount(budgets.overall)} spent
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {formatAmount(Math.max(0, budgets.overall - (currentSpending["overall"]?.monthly ?? 0)))}
              </div>
              <div className={`text-xs ${getStatusText(currentSpending["overall"]?.monthly ?? 0, budgets.overall).color}`}>
                {getStatusText(currentSpending["overall"]?.monthly ?? 0, budgets.overall).text}
              </div>
            </div>
          </div>
          <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${getProgressColor(currentSpending["overall"]?.monthly ?? 0, budgets.overall)}`}
              style={{ width: `${getProgressPercent(currentSpending["overall"]?.monthly ?? 0, budgets.overall)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{Math.round(getProgressPercent(currentSpending["overall"]?.monthly ?? 0, budgets.overall))}% used</span>
            <button 
              onClick={() => openEditModal("overall", budgets.overall)}
              className="text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Edit
            </button>
          </div>
        </Card>
      )}

      {budgetedCategories.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50 mb-3">
            Category Budgets
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgetedCategories.map((cat) => {
              const budget = budgets.perCategory[cat.id]!;
              const spent = currentSpending[cat.id]?.monthly ?? 0;
              const status = getStatusText(spent, budget);

              return (
                <Card key={cat.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: cat.color + "20", color: cat.color }}
                    >
                      <CategoryIcon icon={cat.icon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 justify-between mb-1">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                          {cat.name}
                        </span>
                        <span className={`text-xs font-medium whitespace-nowrap ${status.color}`}>
                          {Math.round(getProgressPercent(spent, budget))}%
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {formatAmount(spent)} / {formatAmount(budget)}
                      </div>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getProgressColor(spent, budget)}`}
                      style={{ width: `${getProgressPercent(spent, budget)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className={status.color}>{status.text}</span>
                    <button 
                      onClick={() => openEditModal(cat.id, budget)}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {categories.filter(c => !budgets.perCategory[c.id] && c.id !== "cat-income").length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
            Add budget for category
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter(c => !budgets.perCategory[c.id] && c.id !== "cat-income")
              .slice(0, 8)
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setShowModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 hover:border-emerald-500 dark:hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <span className="opacity-70"><CategoryIcon icon={cat.icon} /></span>
                  <span>{cat.name}</span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {content}
      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[var(--bg-tertiary)] rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-[var(--border-subtle)] shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
              {selectedCategory && budgets.perCategory[selectedCategory] ? "Edit Budget" : "Create Budget"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                  >
                    <option value="">Select category...</option>
                    <option value="overall">Overall Budget</option>
                    {categories
                      .filter(c => c.id !== "cat-income")
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Budget Limit
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                    {symbol}
                  </span>
                  <input
                    type="number"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Period
                </label>
                <div className="relative">
                  <select
                    value={budgetPeriod}
                    onChange={(e) => setBudgetPeriod(e.target.value as BudgetPeriod)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[var(--bg-secondary)] rounded-xl p-3">
                <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Lightbulb size={12} className="text-amber-500" />
                  <span>Tips</span>
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• You'll be notified when you reach 80% of your budget</li>
                  <li>• Budgets reset automatically each {budgetPeriod === "weekly" ? "week" : budgetPeriod === "monthly" ? "month" : "year"}</li>
                  <li>• Track your progress on the dashboard</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-[var(--bg-secondary)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBudget}
                disabled={!selectedCategory || !budgetLimit || parseFloat(budgetLimit) <= 0}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-900 text-sm font-medium transition-colors"
              >
                {selectedCategory && budgets.perCategory[selectedCategory] ? "Save Changes" : "Create Budget"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BudgetsPage;

