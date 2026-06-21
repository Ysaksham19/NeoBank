import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Budget } from '../../models/budget.model';
import { BudgetService } from '../../core/services/budget';

@Component({
  selector: 'app-budget-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget-dashboard.html',
  styleUrls: ['./budget-dashboard.css']
})
export class BudgetDashboard implements OnInit {

  budgets: Budget[] = [];
  isLoading = false;
  showForm = false;
  submitting = false;
  errorMsg = '';
  successMsg = '';
  selectedMonth = '';

  // ── Edit state ──
  editingId: number | null = null;
  editLimitAmount: number | null = null;
  editSubmitting = false;

  newBudget = {
    category: 'GROCERIES',
    limitAmount: null as number | null,
    month: ''
  };

  readonly categories = [
    'GROCERIES', 'ENTERTAINMENT', 'UTILITIES', 'RENT', 'TRANSFER', 'OTHER'
  ];

  constructor(
    private budgetService: BudgetService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    this.newBudget.month = currentMonth;
    this.selectedMonth = currentMonth;
    this.loadBudgets();
  }

  get filteredBudgets(): Budget[] {
    if (!this.selectedMonth) return this.budgets;
    return this.budgets.filter(b => b.budgetMonth.startsWith(this.selectedMonth));
  }

  goBack(): void {
    this.location.back();
  }

  loadBudgets(): void {
    this.isLoading = true;
    this.budgetService.getMyBudgets().subscribe({
      next: (res) => { this.budgets = res; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  createBudget(): void {
    if (!this.newBudget.category)   { this.errorMsg = 'Category is required.'; return; }
    if (!this.newBudget.limitAmount || this.newBudget.limitAmount <= 0) {
      this.errorMsg = 'Limit must be greater than 0.'; return;
    }
    if (!this.newBudget.month) { this.errorMsg = 'Month is required.'; return; }

    this.errorMsg = '';
    this.submitting = true;

    const payload = {
      category:    this.newBudget.category,
      budgetMonth: this.newBudget.month + '-01',
      limitAmount: Number(this.newBudget.limitAmount)
    };

    this.budgetService.createBudget(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.showForm = false;
        this.successMsg = 'Budget created successfully!';
        this.newBudget = { category: 'GROCERIES', limitAmount: null, month: this.newBudget.month };
        this.loadBudgets();
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMsg = err?.error?.message || 'Failed to create budget. Please try again.';
      }
    });
  }

  deleteBudget(id: number): void {
    if (!confirm('Are you sure you want to delete this budget?')) return;
    this.budgetService.deleteBudget(id).subscribe({
      next: () => {
        this.successMsg = 'Budget deleted.';
        this.loadBudgets();
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: () => { this.errorMsg = 'Delete failed. Please try again.'; }
    });
  }

  // ── Edit methods ──
  startEdit(b: Budget): void {
    this.editingId = b.id;
    this.editLimitAmount = b.limitAmount;
    this.errorMsg = '';
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editLimitAmount = null;
    this.errorMsg = '';
  }

  saveEdit(b: Budget): void {
    if (!this.editLimitAmount || this.editLimitAmount <= 0) {
      this.errorMsg = 'Limit must be greater than 0.';
      return;
    }
    this.editSubmitting = true;
    this.errorMsg = '';

    // ✅ KEY FIX: send all 3 @NotNull fields — not just limitAmount
    // Spring's BudgetRequestDTO validates category + budgetMonth + limitAmount
    const payload = {
      category:    b.category,
      budgetMonth: b.budgetMonth.substring(0, 7) + '-01',
      limitAmount: Number(this.editLimitAmount)
    };

    this.budgetService.updateBudget(b.id, payload).subscribe({
      next: (updated) => {
        this.editSubmitting = false;
        this.editingId = null;
        this.editLimitAmount = null;
        this.successMsg = 'Budget updated successfully!';
        // ✅ Patch in-place — no extra HTTP call needed
        const idx = this.budgets.findIndex(x => x.id === updated.id);
        if (idx !== -1) this.budgets[idx] = updated;
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: (err) => {
        this.editSubmitting = false;
        this.errorMsg = err?.error?.message || 'Update failed. Please try again.';
      }
    });
  }

  // ── Helpers ──
  getProgress(b: Budget): number {
    if (!b.limitAmount || b.limitAmount === 0) return 0;
    return Math.min(100, Math.round((b.spentAmount / b.limitAmount) * 100));
  }

  isOverBudget(b: Budget): boolean {
    return b.spentAmount > b.limitAmount;
  }

  getTotalAllocated(): number {
    return this.filteredBudgets.reduce((s, b) => s + b.limitAmount, 0);
  }

  getTotalSpent(): number {
    return this.filteredBudgets.reduce((s, b) => s + b.spentAmount, 0);
  }

  getUniqueCategoryCount(): number {
    return new Set(this.filteredBudgets.map(b => b.category)).size;
  }

  formatMonth(raw: string): string {
    if (!raw) return '';
    const [year, month] = raw.split('-');
    return new Date(+year, +month - 1, 1).toLocaleDateString('en-IN', {
      month: 'long', year: 'numeric'
    });
  }

  getCategoryIcon(cat: string): string {
    const icons: Record<string, string> = {
      GROCERIES: '🛒', ENTERTAINMENT: '🎬', UTILITIES: '⚡',
      RENT: '🏠', TRANSFER: '💸', OTHER: '📦'
    };
    return icons[cat] ?? '📦';
  }
}