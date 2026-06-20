import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Account } from '../../models/account.model';
import { AccountStateService } from '../../core/services/account-state';
import { TransactionService } from '../../core/services/transaction';

@Component({
  selector: 'app-deposit-money',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
        if (accounts.length > 0) { this.accounts = accounts; this.selectedAccountId = accounts[0].id; }
      });
    }
  }

  depositMoney(): void {
    if (!this.depositRequest.amount || this.depositRequest.amount <= 0) {
      this.errorMessage = 'Amount must be greater than zero.'; return;
    }
    this.errorMessage = '';
    this.loading = true;
    this.transactionService.depositMoney(this.selectedAccountId, this.depositRequest.amount, this.depositRequest.remarks).subscribe({
      next: () => {
        this.loading = false;
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);
        this.depositRequest = { amount: null, remarks: '' };
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Deposit failed. Please try again.';
      }
    });
  }
}
