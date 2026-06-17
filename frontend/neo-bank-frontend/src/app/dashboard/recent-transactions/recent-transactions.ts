import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionService } from '../../core/services/transaction';
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

  constructor(
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {

    this.transactionService
      .getRecentTransactions()
      .subscribe({

        next: (response) => {

          this.transactions = response.slice(0, 5);

        },

        error: (error) => {

          console.error(
            'Failed to load transactions',
            error
          );

        }

      });

  }

}