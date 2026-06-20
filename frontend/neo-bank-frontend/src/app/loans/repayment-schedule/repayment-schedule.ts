import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService } from '../../core/services/loan';
import { RepaymentSchedule } from '../../models/repayment-schedule.model';

@Component({
  selector: 'app-repayment-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './repayment-schedule.html',
  styleUrls: ['./repayment-schedule.css']
})
export class RepaymentScheduleComponent implements OnInit {
  // FIX #19 — properly initialised, bound to input
  loanAccountId: number | null = null;
  repayments: RepaymentSchedule[] = [];
  showToast = false;
  loading = false;
  errorMessage = '';

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    // Nothing to auto-load — user must enter loan account ID and click
  }

  loadRepayments(): void {
    if (!this.loanAccountId || this.loanAccountId <= 0) {
      this.errorMessage = 'Please enter a valid Loan Account ID.'; return;
    }
    this.errorMessage = '';
    this.loading = true;
    this.loanService.getRepaymentSchedule(this.loanAccountId).subscribe({
      next: (res) => { this.repayments = res; this.loading = false; },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to load repayment schedule.';
        this.loading = false;
      }
    });
  }

  markAsPaid(repaymentId: number): void {
    if (!this.loanAccountId) return;
    this.loanService.markRepaymentAsPaid(this.loanAccountId, repaymentId).subscribe({
      next: () => {
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);
        this.loadRepayments();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to mark repayment as paid.';
      }
    });
  }
}
