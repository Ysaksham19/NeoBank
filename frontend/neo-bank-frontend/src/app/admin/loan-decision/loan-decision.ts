import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoanService } from '../../core/services/loan';
import { LoanApplication } from '../../models/loan-application.model';

@Component({
  selector: 'app-loan-decision',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './loan-decision.html',
  styleUrls: ['./loan-decision.css']
})
export class LoanDecision implements OnInit {

  applications: LoanApplication[] = [];
  loading = false;
  errorMessage = '';

  remarks: { [key:number]: string } = {};

  constructor(
    private loanService: LoanService
  ) {}

  ngOnInit(): void {

    this.loadApplications();

  }

  loadApplications(): void {
    this.loading = true;
    this.errorMessage = '';

    this.loanService
      .getAllApplications()
      .subscribe({

        next: (response) => {

          this.applications = response;
          this.loading = false;

        },
        error: (error) => {

          this.errorMessage = error?.error?.message || 'Unable to load loan applications.';
          this.loading = false;
        }

      });

  }

  approve(id: number): void {

    this.loanService
      .decideLoan(id, {

        decision: 'APPROVED',

        adminRemarks: this.remarks[id] || ''

      })
      .subscribe({

        next: () => {

          this.loadApplications();

        },
        error: (error) => {

          this.errorMessage = error?.error?.message || 'Unable to approve this loan application.';
        }

      });

  }

  reject(id: number): void {

    this.loanService
      .decideLoan(id, {

        decision: 'REJECTED',

        adminRemarks: this.remarks[id] || ''

      })
      .subscribe({

        next: () => {

          this.loadApplications();

        },
        error: (error) => {

          this.errorMessage = error?.error?.message || 'Unable to reject this loan application.';
        }

      });

  }

}
