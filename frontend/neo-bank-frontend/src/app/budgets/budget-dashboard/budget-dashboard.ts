import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  constructor(
    private budgetService: BudgetService
  ) {}

  ngOnInit(): void {

    this.loadBudgets();

  }

  loadBudgets(): void {

    this.budgetService
      .getMyBudgets()
      .subscribe({

        next: (response) => {

          this.budgets = response;

        },

        error: (error) => {

          console.error(
            'Failed to load budgets',
            error
          );

        }

      });

  }

  deleteBudget(id: number): void {

    this.budgetService
      .deleteBudget(id)
      .subscribe({

        next: () => {

          this.loadBudgets();

        }

      });

  }

}