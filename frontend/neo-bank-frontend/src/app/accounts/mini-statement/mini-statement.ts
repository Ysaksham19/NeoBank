import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../core/services/transaction';
import { AccountStateService } from '../../core/services/account-state';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-mini-statement',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mini-statement.html',
  styleUrls: ['./mini-statement.css']
})
export class MiniStatement implements OnInit {
  transactions: Transaction[] = [];
  loading = false;
  errorMessage = '';
  accountId!: number;

  constructor(
    private transactionService: TransactionService,
    private accountState: AccountStateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.accountId = +params['id'];
      if (this.accountId) {
        this.loadMiniStatement();
      } else {
        // fallback to first account
        const snap = this.accountState.snapshot;
        if (snap.length > 0) {
          this.accountId = snap[0].id;
          this.loadMiniStatement();
        } else {
          this.accountState.loadAccounts();
          this.accountState.accounts$.subscribe(accounts => {
            if (accounts.length > 0 && !this.accountId) {
              this.accountId = accounts[0].id;
              this.loadMiniStatement();
            }
          });
        }
      }
    });
  }

  loadMiniStatement(): void {
    this.loading = true;
    this.errorMessage = '';
    this.transactionService.getMiniStatement(this.accountId).subscribe({
      next: (res) => {
        // Show only last 10
        this.transactions = res.slice(0, 10);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to load mini statement.';
        this.loading = false;
      }
    });
  }

  refresh(): void { this.loadMiniStatement(); }

  getIcon(type: string): string {
    if (type === 'DEPOSIT')  return '↓';
    if (type === 'TRANSFER') return '⇄';
    return '↑';
  }
}