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

  constructor(
    private loanService: LoanService
  ) {}

  ngOnInit(): void {

    this.loanService
      .getLoanProducts()
      .subscribe({

        next: (response) => {

          this.products = response;

        }

      });

  }

}