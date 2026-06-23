import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Account } from '../../models/account.model';
import { AccountStateService } from '../../core/services/account-state';
import { TransactionService } from '../../core/services/transaction';

@Component({
  selector: 'app-withdraw-money',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './withdraw-money.html',
  styleUrls: ['./withdraw-money.css']
})
export class WithdrawMoney implements OnInit {
  accounts: Account[] = [];
  selectedAccountId!: number;
  showToast      = false;
  toastMessage   = '';
  toastType: 'success' | 'error' = 'success';
  loading        = false;
  errorMessage   = '';
  withdrawnAmount: number | null = null;
  withdrawRequest = { amount: null as number | null, remarks: '' };

  constructor(
    private accountState: AccountStateService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    if (this.accountState.snapshot.length > 0) {
      this.accounts          = this.accountState.snapshot;
      this.selectedAccountId = this.accounts[0].id;
    } else {
      this.accountState.loadAccounts();
      this.accountState.accounts$.subscribe(accounts => {
        if (accounts.length > 0 && this.accounts.length === 0) {
          this.accounts          = accounts;
          this.selectedAccountId = accounts[0].id;
        }
      });
    }
  }

  resetForm(): void {
    this.withdrawRequest  = { amount: null, remarks: '' };
    this.errorMessage     = '';
    this.withdrawnAmount  = null;
    this.showToast        = false;
  }

  withdrawMoney(): void {
    if (!this.withdrawRequest.amount || this.withdrawRequest.amount <= 0) {
      this.errorMessage = 'Please enter a valid amount greater than zero.';
      return;
    }

    const selectedAccount = this.accounts.find(a => a.id === +this.selectedAccountId);
    if (selectedAccount && this.withdrawRequest.amount > selectedAccount.availableBalance) {
      this.errorMessage = 'Insufficient balance in the selected account.';
      return;
    }

    this.errorMessage    = '';
    this.loading         = true;
    this.showToast       = false;
    this.withdrawnAmount = this.withdrawRequest.amount;

    this.transactionService.withdrawMoney(
      +this.selectedAccountId,
      this.withdrawRequest.amount,
      this.withdrawRequest.remarks?.trim() || ''
    ).subscribe({
      next: () => {
        this.loading         = false;
        this.showToast       = true;
        this.toastType       = 'success';
        this.toastMessage    = `₹${this.withdrawnAmount?.toLocaleString('en-IN')} withdrawn successfully!`;
        this.withdrawRequest = { amount: null, remarks: '' };
        this.accountState.loadAccounts();
        // refresh local accounts list so balance updates in dropdown
        this.accountState.accounts$.subscribe(accounts => {
          if (accounts.length > 0) this.accounts = accounts;
        });
        setTimeout(() => this.showToast = false, 5000);
      },
      error: (err) => {
        this.loading      = false;
        this.errorMessage = err?.error?.message || 'Withdrawal failed. Please try again.';
        console.error('withdrawMoney error:', err);
      }
    });
  }
}