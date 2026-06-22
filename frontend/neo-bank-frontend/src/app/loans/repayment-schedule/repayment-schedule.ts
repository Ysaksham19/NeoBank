import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoanService } from '../../core/services/loan';
import { RepaymentSchedule } from '../../models/repayment-schedule.model';

@Component({
  selector: 'app-repayment-schedule',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './repayment-schedule.html',
  styleUrls: ['./repayment-schedule.css']
})
export class RepaymentScheduleComponent implements OnInit {
  schedule: RepaymentSchedule[] = [];
  loading  = true;
  errorMsg = '';
  loanId!: number;

  constructor(private route: ActivatedRoute, private loanService: LoanService) {}

  ngOnInit(): void {
    this.loanId = +this.route.snapshot.paramMap.get('id')!;
    this.loanService.getRepaymentSchedule(this.loanId).subscribe({
      next:  (res) => { this.schedule = res; this.loading = false; },
      error: (err) => { this.errorMsg = err?.error?.message ?? 'Failed to load schedule.'; this.loading = false; }
    });
  }

  get paidCount():    number { return this.schedule.filter(s => s.paymentStatus === 'PAID').length; }
  get pendingCount(): number { return this.schedule.filter(s => s.paymentStatus === 'PENDING').length; }
  get overdueCount(): number { return this.schedule.filter(s => s.paymentStatus === 'OVERDUE').length; }
  get totalPaid():    number { return this.schedule.filter(s => s.paymentStatus === 'PAID').reduce((sum, r) => sum + r.emiAmount, 0); }
  get totalPending(): number { return this.schedule.filter(s => s.paymentStatus !== 'PAID').reduce((sum, r) => sum + r.emiAmount, 0); }
}