import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TransactionService } from '../../core/services/transaction';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './transaction-history.html',
  styleUrls: ['./transaction-history.css']
})
export class TransactionHistory implements OnInit {

  transactions: Transaction[] = [];

  filteredTransactions: Transaction[] = [];

  searchText = '';

  selectedFilter = 'ALL';

  constructor(
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {

    this.loadTransactions();

  }

  loadTransactions(): void {

    this.transactionService
      .getRecentTransactions()
      .subscribe({

        next: (response) => {

          this.transactions = response;

          this.filteredTransactions = response;

        }

      });

  }

  applyFilter(type: string): void {

    this.selectedFilter = type;

    this.filterTransactions();

  }

  onSearch(): void {

    this.filterTransactions();

  }

  filterTransactions(): void {

    this.filteredTransactions = this.transactions.filter(transaction => {

      const matchesSearch =
        transaction.description
          .toLowerCase()
          .includes(this.searchText.toLowerCase());

      const matchesType =
        this.selectedFilter === 'ALL' ||
        transaction.transactionType === this.selectedFilter;

      return matchesSearch && matchesType;

    });

  }

}