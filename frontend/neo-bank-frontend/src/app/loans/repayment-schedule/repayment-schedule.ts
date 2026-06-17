import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoanService } from '../../core/services/loan';
import { RepaymentSchedule } from '../../models/repayment-schedule.model';

@Component({
  selector: 'app-repayment-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './repayment-schedule.html',
  styleUrls: ['./repayment-schedule.css']
})
export class RepaymentScheduleComponent {

  loanAccountId!: number;

  repayments: RepaymentSchedule[] = [];

  showToast = false;

  constructor(
    private loanService: LoanService
  ) {}

  loadRepayments(): void {

    this.loanService
      .getRepaymentSchedule(
        this.loanAccountId
      )
      .subscribe({

        next: (response) => {

          this.repayments = response;

        }

      });

  }

  markAsPaid(repaymentId: number): void {

    this.loanService
      .markRepaymentAsPaid(
        this.loanAccountId,
        repaymentId
      )
      .subscribe({

        next: () => {

          this.showToast = true;

          this.loadRepayments();

          setTimeout(() => {

            this.showToast = false;

          }, 3000);

        }

      });

  }

}