import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TransactionService } from '../../core/services/transaction';
import { AccountStateService } from '../../core/services/account-state';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recent-transactions.html',
  styleUrls: ['./recent-transactions.css']
})
export class RecentTransactions implements OnInit {
  transactions: Transaction[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private transactionService: TransactionService,
    private accountState: AccountStateService
  ) {}

  ngOnInit(): void {
    if (this.accountState.snapshot.length > 0) {
      this.fetchTransactions(this.accountState.snapshot[0].id);
    } else {
      this.accountState.loadAccounts();
      this.accountState.accounts$.subscribe(accounts => {
        if (accounts.length > 0 && this.transactions.length === 0) {
          this.fetchTransactions(accounts[0].id);
        }
      });
    }
  }

  private fetchTransactions(accountId: number): void {
    this.loading = true;
    this.transactionService.getMiniStatement(accountId).subscribe({
      next: (res: Transaction[]) => {       // ✅ explicitly typed
        this.transactions = res.slice(0, 5);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Could not load recent transactions.';
      }
    });
  }

  isCredit(type: string): boolean {
    return (type ?? '').toUpperCase() === 'DEPOSIT';
  }

  getTypeIcon(type: string): string {
    const t = (type ?? '').toUpperCase();
    if (t === 'DEPOSIT')    return '↓';
    if (t === 'WITHDRAWAL') return '↑';
    if (t === 'TRANSFER')   return '⇄';
    return '•';
  }
}