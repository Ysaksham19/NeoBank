import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanService } from '../../core/services/loan';
import { LoanProduct } from '../../models/loan-product.model';

@Component({
  selector: 'app-loan-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-products.html',
  styleUrls: ['./loan-products.css']
})
export class LoanProducts implements OnInit {

  products: LoanProduct[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private loanService: LoanService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.errorMessage = '';

    this.loanService
      .getLoanProducts()
      .subscribe({

        next: (response) => {

          this.products = response;
          this.loading = false;

        },
        error: (error) => {

          this.errorMessage = error?.error?.message || 'Unable to load loan products.';
          this.loading = false;
        }

      });

  }

}
