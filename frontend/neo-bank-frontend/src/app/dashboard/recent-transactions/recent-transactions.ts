import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../core/services/transaction';
import { AccountStateService } from '../../core/services/account-state';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-transactions.html',
  styleUrls: ['./recent-transactions.css']
})
export class RecentTransactions implements OnInit {
  transactions: Transaction[] = [];
  loading = true;

  constructor(
    private transactionService: TransactionService,
    private accountState: AccountStateService
  ) {}

  ngOnInit(): void {
    // FIX #17 — use shared account state; load if cache is empty
    if (this.accountState.snapshot.length > 0) {
      this.fetchTransactions(this.accountState.snapshot[0].id);
    } else {
      this.accountState.loadAccounts();
      this.accountState.accounts$.subscribe(accounts => {
        if (accounts.length > 0) {
          this.fetchTransactions(accounts[0].id);
        }
      });
    }
  }

  private fetchTransactions(accountId: number): void {
    // FIX #3 — use correct mini-statement endpoint
    this.transactionService.getMiniStatement(accountId).subscribe({
      next: (res) => {
        this.transactions = res.slice(0, 5);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
