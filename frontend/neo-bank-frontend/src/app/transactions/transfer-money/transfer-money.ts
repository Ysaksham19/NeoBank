import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Account } from '../../models/account.model';
import { AccountStateService } from '../../core/services/account-state';
import { TransactionService } from '../../core/services/transaction';

@Component({
  selector: 'app-transfer-money',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer-money.html',
  styleUrls: ['./transfer-money.css']
})
export class TransferMoney implements OnInit {
  accounts: Account[] = [];
  selectedAccountId!: number;
  showToast = false;
  loading = false;
  errorMessage = '';
  transferRequest = { receiverAccountNo: '', amount: null as number | null, remarks: '' };

  constructor(
    private accountState: AccountStateService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    // FIX #17 — use shared account state
    if (this.accountState.snapshot.length > 0) {
      this.accounts = this.accountState.snapshot;
      this.selectedAccountId = this.accounts[0].id;
    } else {
      this.accountState.loadAccounts();
      this.accountState.accounts$.subscribe(accounts => {
        if (accounts.length > 0) {
          this.accounts = accounts;
          this.selectedAccountId = accounts[0].id;
        }
      });
    }
  }

  transferMoney(): void {
    // FIX #12 — input validation
    if (!this.transferRequest.receiverAccountNo?.trim()) {
      this.errorMessage = 'Receiver account number is required.'; return;
    }
    if (!this.transferRequest.amount || this.transferRequest.amount <= 0) {
      this.errorMessage = 'Amount must be greater than zero.'; return;
    }
    if (!this.selectedAccountId) {
      this.errorMessage = 'Please select an account.'; return;
    }
    this.errorMessage = '';
    this.loading = true;
    this.transactionService.transferMoney(this.selectedAccountId, this.transferRequest).subscribe({
      next: () => {
        this.loading = false;
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);
        this.transferRequest = { receiverAccountNo: '', amount: null, remarks: '' };
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Transfer failed. Please try again.';
      }
    });
  }
}
