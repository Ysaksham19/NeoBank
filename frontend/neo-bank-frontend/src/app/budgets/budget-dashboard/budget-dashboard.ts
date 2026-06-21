import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { RouterLink } from '@angular/router';

import { Budget } from '../../models/budget.model';
import { BudgetService } from '../../core/services/budget';

@Component({
  selector: 'app-budget-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget-dashboard.html',
  styleUrls: ['./budget-dashboard.css']
})
export class BudgetDashboard implements OnInit {

  budgets: Budget[] = [];
  isLoading = false;

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.isLoading = true;
    this.budgetService.getMyBudgets().subscribe({
      next: (response) => {
        this.budgets = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load budgets', error);
        this.isLoading = false;
      }
    });
  }

  deleteBudget(id: number): void {
    this.budgetService.deleteBudget(id).subscribe({
      next: () => this.loadBudgets(),
      error: (error) => console.error('Delete budget failed', error)
    });
  }

  getTotalAllocated(): number {
    return this.budgets.reduce((sum, b) => sum + b.limitAmount, 0);
  }

  getUniqueCategoryCount(): number {
    return new Set(this.budgets.map(b => b.category)).size;
  }

  formatMonth(raw: string): string {
    if (!raw) return '';
    const [year, month] = raw.split('-');
    const date = new Date(+year, +month - 1, 1);
    return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }
}