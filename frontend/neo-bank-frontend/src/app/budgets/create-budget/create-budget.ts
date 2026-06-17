import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BudgetService } from '../../core/services/budget';

@Component({
  selector: 'app-create-budget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-budget.html',
  styleUrls: ['./create-budget.css']
})
export class CreateBudget {

  showToast = false;

  errorMessage = '';

  categories = [

    'FOOD',
    'SHOPPING',
    'TRAVEL',
    'ENTERTAINMENT',
    'HEALTH',
    'UTILITIES',
    'OTHER'

  ];

  budgetRequest = {

    category: '',

    budgetMonth: '',

    limitAmount: null as number | null

  };

  constructor(
    private budgetService: BudgetService
  ) {}

  createBudget(): void {

    this.errorMessage = '';

    this.budgetService
      .createBudget(this.budgetRequest)
      .subscribe({

        next: () => {

          this.showToast = true;

          setTimeout(() => {

            this.showToast = false;

          }, 3000);

          this.budgetRequest = {

            category: '',

            budgetMonth: '',

            limitAmount: null

          };

        },

        error: (error) => {

          this.errorMessage =

            error?.error?.message ||

            'Failed to create budget';

        }

      });

  }

}