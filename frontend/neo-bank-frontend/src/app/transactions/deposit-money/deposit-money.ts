import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Account } from '../../models/account.model';
import { AccountStateService } from '../../core/services/account-state';
import { TransactionService } from '../../core/services/transaction';

@Component({
  selector: 'app-deposit-money',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './deposit-money.html',
  styleUrls: ['./deposit-money.css']
})
export class DepositMoney implements OnInit {
  accounts: Account[] = [];
  selectedAccountId!: number;
  showToast = false;
  loading = false;
  errorMessage = '';
  depositRequest = { amount: null as number | null, remarks: '' };

  constructor(
    private accountState: AccountStateService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    if (this.accountState.snapshot.length > 0) {
      this.accounts = this.accountState.snapshot;
      this.selectedAccountId = this.accounts[0].id;
    } else {
      this.accountState.loadAccounts();
      this.accountState.accounts$.subscribe(accounts => {
        if (accounts.length > 0 && this.accounts.length === 0) {
          this.accounts = accounts;
          this.selectedAccountId = accounts[0].id;
        }
      });
    }
  }

  resetForm(): void {
    this.depositRequest = { amount: null, remarks: '' };
    this.errorMessage = '';
  }

  depositMoney(): void {
    if (!this.depositRequest.amount || this.depositRequest.amount <= 0) {
      this.errorMessage = 'Please enter a valid amount greater than zero.';
      return;
    }
    this.errorMessage = '';
    this.loading = true;

    const remarks = this.depositRequest.remarks?.trim() || '';

    this.transactionService.depositMoney(
      +this.selectedAccountId,          // ← cast to number
      this.depositRequest.amount,
      remarks
    ).subscribe({
      next: () => {
        this.loading = false;
        this.showToast = true;
        this.depositRequest = { amount: null, remarks: '' };
        this.accountState.loadAccounts();  // ← refresh balance
        setTimeout(() => this.showToast = false, 3000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Deposit failed. Please try again.';
      }
    });
  }
}