import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoanService } from '../../core/services/loan';
import { LoanProduct } from '../../models/loan-product.model';

@Component({
  selector: 'app-apply-loan',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './apply-loan.html',
  styleUrls: ['./apply-loan.css']
})
export class ApplyLoan implements OnInit {

  products: LoanProduct[] = [];

  showToast = false;

  errorMessage = '';

  application = {

    productId: 0,

    amount: null as number | null,

    tenureMonths: null as number | null

  };

  constructor(
    private loanService: LoanService
  ) {}

  ngOnInit(): void {

    this.loanService
      .getLoanProducts()
      .subscribe({

        next: (response) => {

          this.products = response;

          if (response.length > 0) {

            this.application.productId =
              response[0].id;

          }

        }

      });

  }

  applyLoan(): void {

    this.errorMessage = '';

    this.loanService
      .applyLoan(this.application)
      .subscribe({

        next: () => {

          this.showToast = true;

          setTimeout(() => {

            this.showToast = false;

          }, 3000);

          this.application = {

            productId: 0,
            amount: null,
            tenureMonths: null

          };

        },

        error: (error) => {

          this.errorMessage =

            error?.error?.message ||

            'Loan application failed';

        }

      });

  }

}