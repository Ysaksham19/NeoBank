import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../core/services/transaction';
import { AccountStateService } from '../../core/services/account-state';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-history.html',
  styleUrls: ['./transaction-history.css']
})
export class TransactionHistory implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  loading = true;
  searchText = '';
  selectedFilter = 'ALL';

  constructor(
    private transactionService: TransactionService,
    private accountState: AccountStateService
  ) {}

  ngOnInit(): void {
    if (this.accountState.snapshot.length > 0) {
      this.loadTransactions(this.accountState.snapshot[0].id);
    } else {
      this.accountState.loadAccounts();
      this.accountState.accounts$.subscribe(accounts => {
        if (accounts.length > 0) this.loadTransactions(accounts[0].id);
      });
    }
  }

  loadTransactions(accountId: number): void {
    this.transactionService.getAllTransactions(accountId).subscribe({
      next: (res) => {
        this.transactions = res;
        this.filteredTransactions = res;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilter(type: string): void {
    this.selectedFilter = type;
    this.filterTransactions();
  }

  onSearch(): void { this.filterTransactions(); }

  filterTransactions(): void {
    this.filteredTransactions = this.transactions.filter(tx => {
      const matchesSearch = !this.searchText ||
        tx.transactionRef?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        tx.remarks?.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesType = this.selectedFilter === 'ALL' || tx.transactionType === this.selectedFilter;
      return matchesSearch && matchesType;
    });
  }
}
