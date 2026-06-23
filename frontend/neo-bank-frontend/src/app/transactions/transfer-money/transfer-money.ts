import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Account } from '../../models/account.model';
import { AccountStateService } from '../../core/services/account-state';
import { TransactionService } from '../../core/services/transaction';

@Component({
  selector: 'app-transfer-money',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './transfer-money.html',
  styleUrls: ['./transfer-money.css']
})
export class TransferMoney implements OnInit {
  accounts: Account[] = [];
  selectedAccountId!: number;
  showToast = false;
  loading = false;
  errorMessage = '';
  transferRequest = {
    receiverAccountNo: '',
    amount: null as number | null,
    remarks: ''
  };

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
    this.transferRequest = { receiverAccountNo: '', amount: null, remarks: '' };
    this.errorMessage = '';
  }

  transferMoney(): void {
    // Validate
    if (!this.transferRequest.receiverAccountNo?.trim()) {
      this.errorMessage = 'Receiver account number is required.'; return;
    }
    if (!this.transferRequest.amount || this.transferRequest.amount <= 0) {
      this.errorMessage = 'Please enter a valid amount greater than zero.'; return;
    }
    if (!this.selectedAccountId) {
      this.errorMessage = 'Please select an account.'; return;
    }

    // Build clean payload — cast amount to number
    const payload = {
      receiverAccountNo: this.transferRequest.receiverAccountNo.trim(),
      amount: +this.transferRequest.amount,       // ← explicit number cast
      remarks: this.transferRequest.remarks?.trim() || ''
    };

    this.errorMessage = '';
    this.loading = true;

    this.transactionService.transferMoney(
      +this.selectedAccountId,                    // ← cast to number
      payload
    ).subscribe({
      next: () => {
        this.loading = false;
        this.showToast = true;
        this.transferRequest = { receiverAccountNo: '', amount: null, remarks: '' };
        this.accountState.loadAccounts();          // ← refresh balance
        setTimeout(() => this.showToast = false, 3000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Transfer failed. Please try again.';
      }
    });
  }
}