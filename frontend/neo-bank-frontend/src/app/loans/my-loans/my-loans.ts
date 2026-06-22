import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoanService } from '../../core/services/loan';
import { LoanAccount } from '../../models/loan-account.model';
import { LoanApplication } from '../../models/loan-application.model';

@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-loans.html',
  styleUrls: ['./my-loans.css']
})
export class MyLoans implements OnInit {
  loans: LoanAccount[]            = [];
  applications: LoanApplication[] = [];
  loading      = true;
  appsLoading  = true;
  errorMessage = '';
  activeTab: 'accounts' | 'applications' = 'accounts';

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loanService.getMyLoanAccounts().subscribe({
      next:  (res) => { this.loans = res;        this.loading = false; },
      error: ()    => { this.loading = false;     this.errorMessage = 'Failed to load loan accounts.'; }
    });

    this.loanService.getMyApplications().subscribe({
      next:  (res) => { this.applications = res;  this.appsLoading = false; },
      error: ()    => { this.appsLoading  = false; }
    });
  }
}