import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { BudgetService } from '../../core/services/budget';

@Component({
  selector: 'app-create-budget',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-budget.html',
  styleUrls: ['./create-budget.css']
})
export class CreateBudget {

  categories = [
    'GROCERIES', 'UTILITIES', 'RENT',
    'ENTERTAINMENT', 'TRANSFER', 'OTHER'
  ];

  budgetRequest = {
    category: '',
    budgetMonth: '',
    limitAmount: null as number | null
  };

  errorMessage = '';
  showToast = false;
  isSubmitting = false;

  constructor(
    private budgetService: BudgetService,
    private router: Router
  ) {}

  createBudget(): void {
    this.errorMessage = '';

    if (!this.budgetRequest.category) {
      this.errorMessage = 'Please select a spending category.';
      return;
    }
    if (!this.budgetRequest.budgetMonth) {
      this.errorMessage = 'Please select a budget month.';
      return;
    }
    if (!this.budgetRequest.limitAmount || this.budgetRequest.limitAmount <= 0) {
      this.errorMessage = 'Limit amount must be greater than ₹0.';
      return;
    }

    this.isSubmitting = true;
    this.budgetService.createBudget(this.budgetRequest).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
          this.router.navigate(['/budgets']);
        }, 1800);
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 409) {
          this.errorMessage = 'A budget for this category and month already exists.';
        } else if (err.status === 400) {
          this.errorMessage = err.error?.message || 'Invalid input. Please check your values.';
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
      }
    });
  }
}