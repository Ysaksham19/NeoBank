import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../core/services/account';
import { AccountStateService } from '../../core/services/account-state';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account-list.html',
  styleUrls: ['./account-list.css']
})
export class AccountList implements OnInit {
  accounts: Account[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private accountService: AccountService,
    private accountState: AccountStateService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.accountService.getMyAccounts().subscribe({
      next: (res) => {
        this.accounts = res;
        this.accountState['accountsSubject'].next(res); // keep state in sync
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to load accounts.';
        this.loading = false;
      }
    });
  }

  refresh(): void { this.loadAccounts(); }

  maskAccount(accountNumber: string): string {
    return '**** **** **** ' + accountNumber.slice(-4);
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase() === 'active' ? 'badge-active' : 'badge-inactive';
  }

  getAccountIcon(type: string): string {
    const t = type?.toUpperCase();
    if (t?.includes('SAVING')) return '🏦';
    if (t?.includes('CURRENT')) return '💼';
    if (t?.includes('FIXED')) return '🔒';
    return '💳';
  }
}