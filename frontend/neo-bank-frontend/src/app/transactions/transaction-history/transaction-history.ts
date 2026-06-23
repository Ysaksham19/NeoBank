import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TransactionService } from '../../core/services/transaction';
import { AccountStateService } from '../../core/services/account-state';
import { Transaction } from '../../models/transaction.model';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './transaction-history.html',
  styleUrls: ['./transaction-history.css']
})
export class TransactionHistory implements OnInit {
  accounts: Account[] = [];
  selectedAccountId!: number;

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];

  loading        = false;
  errorMessage   = '';
  searchText     = '';
  selectedFilter = 'ALL';

  constructor(
    private transactionService: TransactionService,
    private accountState: AccountStateService
  ) {}

  ngOnInit(): void {
    if (this.accountState.snapshot.length > 0) {
      this.accounts          = this.accountState.snapshot;
      this.selectedAccountId = this.accounts[0].id;
      this.loadTransactions();
    } else {
      this.accountState.loadAccounts();
      this.accountState.accounts$.subscribe(accounts => {
        if (accounts.length > 0 && this.accounts.length === 0) {
          this.accounts          = accounts;
          this.selectedAccountId = accounts[0].id;
          this.loadTransactions();
        }
      });
    }
  }

  loadTransactions(): void {
    this.loading      = true;
    this.errorMessage = '';
    this.transactionService.getAllTransactions(+this.selectedAccountId).subscribe({
      next: (res) => {
        this.transactions = res;
        this.applyFilterAndSearch();
        this.loading = false;
      },
      error: (err) => {
        this.loading      = false;
        this.errorMessage = err?.error?.message || 'Failed to load transactions. Please try again.';
        console.error('loadTransactions error:', err);
      }
    });
  }

  onAccountChange(): void {
    this.searchText     = '';
    this.selectedFilter = 'ALL';
    this.loadTransactions();
  }

  refresh(): void { this.loadTransactions(); }

  applyFilter(type: string): void {
    this.selectedFilter = type;
    this.applyFilterAndSearch();
  }

  onSearch(): void { this.applyFilterAndSearch(); }

  applyFilterAndSearch(): void {
    this.filteredTransactions = this.transactions.filter(tx => {
      const matchesSearch = !this.searchText ||
        tx.transactionRef?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        tx.remarks?.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesType = this.selectedFilter === 'ALL' ||
        tx.transactionType?.toUpperCase() === this.selectedFilter.toUpperCase();
      return matchesSearch && matchesType;
    });
  }

  // ── DB stores DEPOSIT / DEBIT / TRANSFER ─────────────────────────
  isCredit(type: string): boolean {
    return (type ?? '').toUpperCase() === 'DEPOSIT';
  }

  getTypeIcon(type: string): string {
    const t = (type ?? '').toUpperCase();
    if (t === 'DEPOSIT')  return '↓';
    if (t === 'DEBIT')    return '↑';   // ← was WITHDRAWAL, DB stores DEBIT
    if (t === 'TRANSFER') return '⇄';
    return '•';
  }

  getTypeClass(type: string): string {
    const t = (type ?? '').toUpperCase();
    if (t === 'DEPOSIT')  return 'type-credit';
    if (t === 'DEBIT')    return 'type-debit';   // ← was WITHDRAWAL
    if (t === 'TRANSFER') return 'type-transfer';
    return 'type-default';
  }

  maskAccount(accountNo: string): string {
    if (!accountNo) return '****';
    return '****' + accountNo.slice(-4);
  }
}