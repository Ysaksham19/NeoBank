import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Account } from '../../models/account.model';
import { AccountStateService } from '../../core/services/account-state';
import { TransactionService } from '../../core/services/transaction';

@Component({
  selector: 'app-withdraw-money',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./withdraw-money.html',
  styleUrls: ['./withdraw-money.css']
})
export class WithdrawMoney implements OnInit {
  accounts: Account[] = [];
  selectedAccountId!: number;
  showToast = false;
  loading = false;
  errorMessage = '';
  withdrawRequest = { amount: null as number | null, remarks: '' };

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
        if (accounts.length > 0) { this.accounts = accounts; this.selectedAccountId = accounts[0].id; }
      });
    }
  }

  withdrawMoney(): void {
    if (!this.withdrawRequest.amount || this.withdrawRequest.amount <= 0) {
      this.errorMessage = 'Amount must be greater than zero.'; return;
    }
    this.errorMessage = '';
    this.loading = true;
    this.transactionService.withdrawMoney(this.selectedAccountId, this.withdrawRequest.amount, this.withdrawRequest.remarks).subscribe({
      next: () => {
        this.loading = false;
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);
        this.withdrawRequest = { amount: null, remarks: '' };
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Withdrawal failed. Please try again.';
      }
    });
  }
}
