import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoanService } from '../../core/services/loan';
import { LoanProduct } from '../../models/loan-product.model';

@Component({
  selector: 'app-apply-loan',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './apply-loan.html',
  styleUrls: ['./apply-loan.css']
})
export class ApplyLoan implements OnInit {
  products: LoanProduct[]             = [];
  selectedProduct: LoanProduct | null = null;
  showToast    = false;
  loading      = false;
  errorMessage = '';

  loanPurposes = [
    'Home Renovation', 'Medical Emergency', 'Education',
    'Wedding', 'Travel', 'Debt Consolidation',
    'Business', 'Vehicle Purchase', 'Other'
  ];

  application = {
    loanProductId:         0,
    requestedAmount:       null as number | null,
    requestedTenureMonths: null as number | null,
    monthlyIncome:         null as number | null,
    loanPurpose:           ''
  };

  constructor(private loanService: LoanService, private router: Router) {}

  ngOnInit(): void {
    this.loanService.getLoanProducts().subscribe({
      next: (res) => {
        this.products = res;
        if (res.length > 0) {
          this.application.loanProductId = res[0].id;
          this.selectedProduct = res[0];
        }
      },
      error: () => { this.errorMessage = 'Failed to load loan products.'; }
    });
  }

  onProductChange(): void {
    this.selectedProduct = this.products.find(
      p => p.id == this.application.loanProductId
    ) ?? null;
    this.application.requestedAmount       = null;
    this.application.requestedTenureMonths = null;
  }

  get emiPreview(): number | null {
    const p = this.application.requestedAmount;
    const n = this.application.requestedTenureMonths;
    const r = this.selectedProduct
      ? this.selectedProduct.annualInterestRate / 12 / 100
      : null;
    if (!p || !n || !r || p <= 0 || n <= 0) return null;
    return Math.round(
      (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) * 100
    ) / 100;
  }

  // ✅ Minimum income required = 3× EMI (real bank rule)
  get minIncomeRequired(): number | null {
    return this.emiPreview ? Math.ceil(this.emiPreview * 3) : null;
  }

  get allowedTenureList(): number[] {
    if (!this.selectedProduct?.allowedTenures) return [];
    return this.selectedProduct.allowedTenures
      .split(',').map(t => +t.trim()).filter(t => !isNaN(t));
  }

  get totalInterest(): number {
    if (!this.emiPreview || !this.application.requestedTenureMonths
        || !this.application.requestedAmount) return 0;
    return Math.round(
      (this.emiPreview * this.application.requestedTenureMonths
        - this.application.requestedAmount) * 100
    ) / 100;
  }

  applyLoan(): void {
    const p = this.selectedProduct;

    if (!this.application.requestedAmount || this.application.requestedAmount <= 0) {
      this.errorMessage = 'Please enter a valid loan amount.'; return;
    }
    if (p && (this.application.requestedAmount < p.minAmount
          || this.application.requestedAmount > p.maxAmount)) {
      this.errorMessage =
        `Amount must be between ₹${p.minAmount.toLocaleString()} and ₹${p.maxAmount.toLocaleString()}.`;
      return;
    }
    if (!this.application.requestedTenureMonths) {
      this.errorMessage = 'Please select a tenure.'; return;
    }
    if (!this.application.monthlyIncome || this.application.monthlyIncome <= 0) {
      this.errorMessage = 'Please enter your monthly income.'; return;
    }
    if (this.minIncomeRequired && this.application.monthlyIncome < this.minIncomeRequired) {
      this.errorMessage =
        `Your monthly income must be at least ₹${this.minIncomeRequired.toLocaleString()} to qualify (3× EMI rule).`;
      return;
    }
    if (!this.application.loanPurpose) {
      this.errorMessage = 'Please select a loan purpose.'; return;
    }

    this.errorMessage = '';
    this.loading = true;

    this.loanService.applyLoan(this.application).subscribe({
      next: () => {
        this.loading   = false;
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
          this.router.navigate(['/loans']);
        }, 2500);
        this.application = {
          loanProductId:         this.application.loanProductId,
          requestedAmount:       null,
          requestedTenureMonths: null,
          monthlyIncome:         null,
          loanPurpose:           ''
        };
      },
      error: (error) => {
        this.loading      = false;
        this.errorMessage = error?.error?.message ?? 'Loan application failed.';
      }
    });
  }
}