import React, { useState, useMemo } from "react";
import { useRecurring, RecurringPayment } from "../context/RecurringContext";
import { useCurrency } from "../context/CurrencyContext";
import { useCategories } from "../context/CategoriesContext";
import { useNotifications } from "../context/NotificationsContext";
import { Card } from "../components/Card";
import { 
  Home, 
  Lightbulb, 
  ShieldCheck, 
  Smartphone, 
  ShoppingCart, 
  UtensilsCrossed, 
  Car, 
  Building2, 
  CreditCard, 
  Phone, 
  BookOpen, 
  Dumbbell, 
  Heart, 
  CircleDollarSign, 
  Hospital, 
  Film, 
  Sparkles, 
  Dog, 
  Wrench, 
  ClipboardList, 
  Package,
  Plus,
  RefreshCw,
  Edit2,
  Pause,
  Trash2,
  ChevronDown
} from "lucide-react";

// Recurring-specific categories
const recurringCategories = [
  { id: "rec-rent", name: "Rent/Mortgage", icon: <Home size={18} /> },
  { id: "rec-utilities", name: "Utilities", icon: <Lightbulb size={18} /> },
  { id: "rec-insurance", name: "Insurance", icon: <ShieldCheck size={18} /> },
  { id: "rec-subscriptions", name: "Subscriptions", icon: <Smartphone size={18} /> },
  { id: "rec-groceries", name: "Groceries", icon: <ShoppingCart size={18} /> },
  { id: "rec-dining", name: "Dining Out", icon: <UtensilsCrossed size={18} /> },
  { id: "rec-transport", name: "Transportation/Fuel", icon: <Car size={18} /> },
  { id: "rec-loan", name: "Loan Payments", icon: <Building2 size={18} /> },
  { id: "rec-credit", name: "Credit Card Payments", icon: <CreditCard size={18} /> },
  { id: "rec-phone", name: "Phone/Internet Bill", icon: <Phone size={18} /> },
  { id: "rec-childcare", name: "Childcare/Education", icon: <BookOpen size={18} /> },
  { id: "rec-gym", name: "Gym/Fitness", icon: <Dumbbell size={18} /> },
  { id: "rec-charity", name: "Charitable Donations", icon: <Heart size={18} /> },
  { id: "rec-savings", name: "Savings/Investments", icon: <CircleDollarSign size={18} /> },
  { id: "rec-health", name: "Health/Medical", icon: <Hospital size={18} /> },
  { id: "rec-entertainment", name: "Entertainment", icon: <Film size={18} /> },
  { id: "rec-personal", name: "Personal Care", icon: <Sparkles size={18} /> },
  { id: "rec-pet", name: "Pet Expenses", icon: <Dog size={18} /> },
  { id: "rec-home", name: "Home Maintenance", icon: <Wrench size={18} /> },
  { id: "rec-taxes", name: "Taxes", icon: <ClipboardList size={18} /> },
  { id: "rec-other", name: "Other", icon: <Package size={18} /> },
];

const RecurringPage: React.FC = () => {
  const { payments, addPayment, updatePayment, deletePayment, togglePayment } = useRecurring();
  const { formatAmount, symbol } = useCurrency();
  const { addNotification } = useNotifications();
  
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<RecurringPayment | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [frequency, setFrequency] = useState<RecurringPayment["frequency"]>("monthly");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setNextDueDate("");
    setFrequency("monthly");
    setCategory(recurringCategories[0]?.id ?? "");
    setIsActive(true);
    setEditingPayment(null);
  };

  const openAddModal = () => {
    resetForm();
    setNextDueDate(new Date().toISOString().slice(0, 10));
    setCategory(recurringCategories[0]?.id ?? "");
    setShowModal(true);
  };

  const openEditModal = (payment: RecurringPayment) => {
    setEditingPayment(payment);
    setDescription(payment.description);
    setAmount(payment.amount.toString());
    setNextDueDate(payment.nextDueDate);
    setFrequency(payment.frequency);
    setCategory(payment.category);
    setIsActive(payment.isActive);
    setShowModal(true);
  };

  const handleSave = () => {
    const amountNum = parseFloat(amount);
    if (!description.trim() || isNaN(amountNum) || amountNum <= 0 || !nextDueDate) return;

    if (editingPayment) {
      updatePayment(editingPayment.id, {
        description: description.trim(),
        amount: amountNum,
        nextDueDate,
        frequency,
        category,
        isActive
      });
    } else {
      addPayment({
        description: description.trim(),
        amount: amountNum,
        nextDueDate,
        frequency,
        category,
        isActive
      });
      
      // Add notification for upcoming payment
      const daysUntil = getDaysUntilDue(nextDueDate);
      if (daysUntil <= 7 && daysUntil >= 0) {
        addNotification({
          type: "payment_due",
          title: "Upcoming Payment",
          message: `${description.trim()} (${formatAmount(amountNum)}) is due ${daysUntil === 0 ? "today" : daysUntil === 1 ? "tomorrow" : `in ${daysUntil} days`}`
        });
      }
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deletePayment(id);
    setShowDeleteConfirm(null);
  };

  const getCategoryInfo = (catId: string) => {
    return recurringCategories.find(c => c.id === catId) ?? { id: catId, name: catId, icon: <Package size={18} /> };
  };

  const getFrequencyLabel = (freq: RecurringPayment["frequency"]) => {
    switch (freq) {
      case "daily": return "Daily";
      case "weekly": return "Weekly";
      case "monthly": return "Monthly";
      case "yearly": return "Yearly";
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate + "T00:00:00");
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const activePayments = payments.filter(p => p.isActive);
  const inactivePayments = payments.filter(p => !p.isActive);
  
  // Calculate totals
  const monthlyTotal = useMemo(() => {
    return activePayments.reduce((sum, p) => {
      if (p.frequency === "monthly") return sum + p.amount;
      if (p.frequency === "yearly") return sum + (p.amount / 12);
      if (p.frequency === "weekly") return sum + (p.amount * 4.33);
      if (p.frequency === "daily") return sum + (p.amount * 30);
      return sum;
    }, 0);
  }, [activePayments]);

  const yearlyTotal = monthlyTotal * 12;

  // Content - Empty state or filled
  const content = payments.length === 0 ? (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">
          Recurring Payments
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Manage your subscriptions and recurring bills
        </p>
      </div>

      <Card className="text-center py-16">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-[var(--bg-secondary)] flex items-center justify-center text-slate-400">
            <RefreshCw size={32} />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
          No recurring payments yet
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
          Add your subscriptions and bills to track upcoming payments
        </p>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-900 text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          <span>Add Your First Payment</span>
        </button>
      </Card>

      <Card>
        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-50 mb-3 flex items-center gap-2">
          <Lightbulb size={16} className="text-amber-500" />
          <span>Tips</span>
        </h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <li>• Track subscriptions like Netflix, Spotify, or gym memberships</li>
          <li>• Add regular bills like rent, utilities, or insurance</li>
          <li>• Get notified before payments are due</li>
          <li>• Pause payments temporarily without deleting them</li>
        </ul>
      </Card>
    </div>
  ) : (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">
            Recurring Payments
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {activePayments.length} active payment{activePayments.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-900 text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          <span>Add Payment</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Monthly Total</div>
          <div className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            {formatAmount(monthlyTotal)}
          </div>
        </Card>
        <Card>
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Yearly Total</div>
          <div className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            {formatAmount(yearlyTotal)}
          </div>
        </Card>
      </div>

      {/* Active Payments */}
      {activePayments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">
            Upcoming Payments
          </h3>
          {activePayments
            .sort((a, b) => getDaysUntilDue(a.nextDueDate) - getDaysUntilDue(b.nextDueDate))
            .map((payment) => {
              const daysUntil = getDaysUntilDue(payment.nextDueDate);
              const cat = getCategoryInfo(payment.category);
              
              return (
                <Card key={payment.id} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-[var(--bg-secondary)] flex items-center justify-center text-slate-500 dark:text-slate-400">
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-[var(--text-primary)] truncate">
                        {payment.description}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[var(--bg-secondary)] text-slate-600 dark:text-[var(--text-paragraph)] shrink-0">
                        {getFrequencyLabel(payment.frequency)}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {daysUntil === 0 && <span className="text-amber-500 font-medium">Due today</span>}
                      {daysUntil === 1 && <span className="text-amber-500 font-medium">Due tomorrow</span>}
                      {daysUntil > 1 && daysUntil <= 7 && <span className="text-amber-500">Due in {daysUntil} days</span>}
                      {daysUntil > 7 && <span>Due {new Date(payment.nextDueDate + "T00:00:00").toLocaleDateString()}</span>}
                      {daysUntil < 0 && <span className="text-red-500 font-medium">Overdue by {Math.abs(daysUntil)} days</span>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold text-slate-900 dark:text-[var(--text-primary)]">
                      {formatAmount(payment.amount)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(payment)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[var(--bg-secondary)] text-slate-500 dark:text-[var(--text-paragraph)]"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => togglePayment(payment.id)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[var(--bg-secondary)] text-slate-500 dark:text-[var(--text-paragraph)]"
                      title="Pause"
                    >
                      <Pause size={16} />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(payment.id)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Card>
              );
            })}
        </div>
      )}

      {/* Inactive Payments */}
      {inactivePayments.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
            Paused ({inactivePayments.length})
          </h3>
          <div className="space-y-3 opacity-60">
            {inactivePayments.map((payment) => {
              const cat = getCategoryInfo(payment.category);
              
              return (
                <Card key={payment.id} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-[var(--bg-secondary)] flex items-center justify-center text-slate-500 dark:text-slate-400">
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-slate-900 dark:text-[var(--text-primary)] truncate">
                      {payment.description}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-[var(--text-paragraph)]">
                      {getFrequencyLabel(payment.frequency)} • Paused
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold text-slate-900 dark:text-[var(--text-primary)]">
                      {formatAmount(payment.amount)}
                    </div>
                  </div>
                  <button
                    onClick={() => togglePayment(payment.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium shrink-0"
                  >
                    Resume
                  </button>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {content}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[var(--bg-tertiary)] rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-[var(--border-subtle)] shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
              {editingPayment ? "Edit Payment" : "Add Recurring Payment"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Netflix Subscription, Electric Bill"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                    {symbol}
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Next Due Date
                </label>
                <input
                  type="date"
                  value={nextDueDate}
                  onChange={(e) => setNextDueDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Frequency
                </label>
                <div className="relative">
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as RecurringPayment["frequency"])}
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

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] text-slate-900 dark:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                  >
                    {recurringCategories.map((cat) => (
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

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Active</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Receive notifications</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-[var(--border-subtle)]"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      isActive ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-[var(--bg-secondary)] rounded-xl p-3">
                <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Lightbulb size={12} className="text-amber-500" />
                  <span>Payment Tips</span>
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Set due dates a few days before the actual due date for reminders</li>
                  <li>• Use descriptive names to easily identify payments</li>
                  <li>• Review and update amounts when prices change</li>
                  <li>• Deactivate payments you've cancelled to keep your list clean</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-[var(--bg-secondary)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!description.trim() || !amount || parseFloat(amount) <= 0 || !nextDueDate}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-900 text-sm font-medium transition-colors"
              >
                {editingPayment ? "Save Changes" : "Add Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[var(--bg-tertiary)] rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-[var(--border-subtle)] shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Delete Payment?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              This will permanently delete this recurring payment. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-[var(--border-subtle)] text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-[var(--bg-secondary)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecurringPage;

