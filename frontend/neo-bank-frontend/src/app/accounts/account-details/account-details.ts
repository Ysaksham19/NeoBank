import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../core/services/account';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account-details.html',
  styleUrls: ['./account-details.css']
})
export class AccountDetails implements OnInit {
  account?: Account;
  loading = false;
  errorMessage = '';
  accountId!: number;
  numberRevealed = false;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.accountId = +params['id'];
      if (this.accountId) {
        this.loadAccount();
      } else {
        // fallback: load first account
        this.loadFirstAccount();
      }
    });
  }

  loadAccount(): void {
    this.loading = true;
    this.errorMessage = '';
    this.accountService.getAccountById(this.accountId).subscribe({
      next: (res) => { this.account = res; this.loading = false; },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to load account details.';
        this.loading = false;
      }
    });
  }

  loadFirstAccount(): void {
    this.loading = true;
    this.accountService.getMyAccounts().subscribe({
      next: (accounts) => {
        if (accounts.length > 0) this.account = accounts[0];
        else this.errorMessage = 'No accounts found.';
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to load account details.';
        this.loading = false;
      }
    });
  }

  refresh(): void {
    if (this.accountId) this.loadAccount();
    else this.loadFirstAccount();
  }

  toggleNumber(): void { this.numberRevealed = !this.numberRevealed; }

  maskAccount(accountNumber: string): string {
    return '**** **** **** ' + accountNumber?.slice(-4);
  }

  getAccountIcon(type: string): string {
    const t = type?.toUpperCase();
    if (t?.includes('SAVING'))  return '🏦';
    if (t?.includes('CURRENT')) return '💼';
    if (t?.includes('FIXED'))   return '🔒';
    return '💳';
  }
}