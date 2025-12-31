import React, { useState } from "react";
import { useGoals, Goal } from "../context/GoalsContext";
import { useCurrency } from "../context/CurrencyContext";
import { usePro } from "../context/ProContext";
import { Card } from "../components/Card";

const GoalsPage: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, updateGoalProgress } = useGoals();
  const { formatAmount, symbol } = useCurrency();
  const { isProUser, setShowGoProModal, setLockedFeature } = usePro();

  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    category: "",
    description: ""
  });

  const handleOpenModal = (goal?: Goal) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        deadline: goal.deadline,
        category: goal.category,
        description: goal.description || ""
      });
    } else {
      setEditingGoal(null);
      setFormData({
        name: "",
        targetAmount: "",
        currentAmount: "",
        deadline: "",
        category: "",
        description: ""
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGoal(null);
    setFormData({
      name: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
      category: "",
      description: ""
    });
  };

  const handleSaveGoal = () => {
    const target = parseFloat(formData.targetAmount);
    const current = parseFloat(formData.currentAmount);

    if (!formData.name || isNaN(target) || isNaN(current) || target <= 0) {
      return;
    }

    if (editingGoal) {
      updateGoal(editingGoal.id, {
        name: formData.name,
        targetAmount: target,
        currentAmount: Math.min(current, target),
        deadline: formData.deadline,
        category: formData.category,
        description: formData.description
      });
    } else {
      addGoal({
        name: formData.name,
        targetAmount: target,
        currentAmount: Math.min(current, target),
        deadline: formData.deadline,
        category: formData.category,
        description: formData.description
      });
    }
    handleCloseModal();
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date() && deadline !== "";
  };

  if (!isProUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          Financial Goals
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Set and track savings targets with the Pro plan
        </p>
        <button
          onClick={() => {
            setLockedFeature("Financial goals");
            setShowGoProModal(true);
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          ⭐ Upgrade to Pro
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Financial Goals
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + New Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No goals yet. Create your first savings goal!
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
          >
            Create a goal
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const progress = getProgressPercentage(goal);
            const remaining = goal.targetAmount - goal.currentAmount;
            const overdue = isOverdue(goal.deadline);

            return (
              <Card
                key={goal.id}
                className={`flex flex-col ${
                  overdue ? "ring-2 ring-red-500/50" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                      {goal.name}
                    </h3>
                    {goal.category && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {goal.category}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-red-500 hover:text-red-600 font-semibold"
                  >
                    ✕
                  </button>
                </div>

                {goal.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {goal.description}
                  </p>
                )}

                <div className="space-y-3 flex-1 mb-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Progress
                      </span>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Current
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-50">
                      {symbol}
                      {goal.currentAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Target
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-50">
                      {symbol}
                      {goal.targetAmount.toFixed(2)}
                    </span>
                  </div>

                  {progress < 100 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        Remaining
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-50">
                        {symbol}
                        {remaining.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {goal.deadline && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        Deadline
                      </span>
                      <span
                        className={`font-semibold ${
                          overdue
                            ? "text-red-600 dark:text-red-400"
                            : "text-slate-900 dark:text-slate-50"
                        }`}
                      >
                        {new Date(goal.deadline).toLocaleDateString()}
                        {overdue && " (Overdue)"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(goal)}
                    className="flex-1 border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] hover:bg-slate-50 dark:hover:bg-[var(--bg-tertiary)] text-slate-900 dark:text-[var(--text-primary)] py-2 rounded-lg font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => updateGoalProgress(goal.id, 10)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium transition-colors"
                    title="Add $10 to progress"
                  >
                    +$10
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                {editingGoal ? "Edit Goal" : "New Goal"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-[var(--text-secondary)] mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Summer Vacation"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] text-slate-900 dark:text-[var(--text-primary)] placeholder-slate-500 dark:placeholder:text-[var(--text-muted)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Amount
                </label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAmount: e.target.value })
                  }
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] text-slate-900 dark:text-[var(--text-primary)] placeholder-slate-500 dark:placeholder:text-[var(--text-muted)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Current Amount
                </label>
                <input
                  type="number"
                  value={formData.currentAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, currentAmount: e.target.value })
                  }
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] text-slate-900 dark:text-[var(--text-primary)] placeholder-slate-500 dark:placeholder:text-[var(--text-muted)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Travel, Emergency Fund"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] text-slate-900 dark:text-[var(--text-primary)] placeholder-slate-500 dark:placeholder:text-[var(--text-muted)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Optional notes..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-secondary)] text-slate-900 dark:text-[var(--text-primary)] placeholder-slate-500 dark:placeholder:text-[var(--text-muted)]"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-50 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGoal}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Save Goal
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
