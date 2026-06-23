import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoanService } from '../../core/services/loan';

@Component({
  selector: 'app-repayment-schedule',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './repayment-schedule.html',
  styleUrls: ['./repayment-schedule.css']
})
export class RepaymentScheduleComponent implements OnInit {
  schedule: any[] = [];
  loading      = true;
  errorMsg     = '';
  successMsg   = '';
  loanId!: number;
  payingId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private loanService: LoanService
  ) {}

  ngOnInit(): void {
    this.loanId = +this.route.snapshot.paramMap.get('id')!;
    this.loadSchedule();
  }

  loadSchedule(): void {
    this.loading = true;
    this.loanService.getRepaymentSchedule(this.loanId).subscribe({
      next:  (res) => { this.schedule = res; this.loading = false; },
      error: (err) => {
        this.errorMsg = err?.error?.message ?? 'Failed to load schedule.';
        this.loading  = false;
      }
    });
  }

  // ✅ Next instalment that must be paid (sequential rule)
  get nextDueInstalment(): any | null {
    return this.schedule.find(
      s => s.paymentStatus === 'PENDING' || s.paymentStatus === 'OVERDUE'
    ) ?? null;
  }

  canPay(row: any): boolean {
    return this.nextDueInstalment?.instalmentNumber === row.instalmentNumber;
  }

  payEmi(row: any): void {
    if (!this.canPay(row)) return;
    this.payingId  = row.instalmentNumber;
    this.errorMsg  = '';
    this.successMsg = '';

    this.loanService.markRepaymentAsPaid(this.loanId, row.repaymentId ?? row.id).subscribe({
      next: (res: any) => {
        this.payingId   = null;
        this.successMsg = typeof res === 'string' ? res : (res?.message ?? 'EMI paid successfully!');
        this.loadSchedule(); // refresh to show updated outstanding + status
        setTimeout(() => this.successMsg = '', 4000);
      },
      error: (err) => {
        this.payingId = null;
        this.errorMsg = err?.error?.message ?? 'Payment failed. Please try again.';
      }
    });
  }

  get paidCount():    number { return this.schedule.filter(s => s.paymentStatus === 'PAID').length; }
  get pendingCount(): number { return this.schedule.filter(s => s.paymentStatus === 'PENDING').length; }
  get overdueCount(): number { return this.schedule.filter(s => s.paymentStatus === 'OVERDUE').length; }
  get totalPaid():    number { return this.schedule.filter(s => s.paymentStatus === 'PAID').reduce((sum, r) => sum + r.emiAmount, 0); }
  get totalPending(): number { return this.schedule.filter(s => s.paymentStatus !== 'PAID').reduce((sum, r) => sum + r.emiAmount, 0); }
  get isLoanClosed(): boolean { return this.paidCount === this.schedule.length && this.schedule.length > 0; }
}