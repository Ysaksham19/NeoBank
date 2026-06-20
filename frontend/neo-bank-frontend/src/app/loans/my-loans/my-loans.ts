import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../core/services/loan';
import { LoanAccount } from '../../models/loan-account.model';

@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-loans.html',
  styleUrls: ['./my-loans.css']
})
export class MyLoans implements OnInit {
  loans: LoanAccount[] = [];
  applications: any[] = [];
  loading = true;
  activeTab: 'accounts' | 'applications' = 'accounts';

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loanService.getMyLoanAccounts().subscribe({
      next: (res) => { this.loans = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
    // FIX #10 — load my applications
    this.loanService.getMyApplications().subscribe({
      next: (res) => { this.applications = res; },
      error: () => {}
    });
  }
}
