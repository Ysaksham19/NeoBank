import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService } from '../../core/services/loan';
import { LoanProduct } from '../../models/loan-product.model';

@Component({
  selector: 'app-apply-loan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apply-loan.html',
  styleUrls: ['./apply-loan.css']
})
export class ApplyLoan implements OnInit {
  products: LoanProduct[] = [];
  showToast = false;
  loading = false;
  errorMessage = '';

  // FIX #13 — correct field names matching backend DTO
  application = {
    loanProductId: 0,
    requestedAmount: null as number | null,
    requestedTenureMonths: null as number | null
  };

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loanService.getLoanProducts().subscribe({
      next: (res) => {
        this.products = res;
        if (res.length > 0) this.application.loanProductId = res[0].id;
      },
      error: (err) => { this.errorMessage = 'Failed to load loan products.'; }
    });
  }

  applyLoan(): void {
    if (!this.application.requestedAmount || this.application.requestedAmount <= 0) {
      this.errorMessage = 'Please enter a valid loan amount.'; return;
    }
    if (!this.application.requestedTenureMonths || this.application.requestedTenureMonths <= 0) {
      this.errorMessage = 'Please enter a valid tenure.'; return;
    }
    this.errorMessage = '';
    this.loading = true;
    this.loanService.applyLoan(this.application).subscribe({
      next: () => {
        this.loading = false;
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);
        this.application = { loanProductId: this.application.loanProductId, requestedAmount: null, requestedTenureMonths: null };
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Loan application failed.';
      }
    });
  }
}
