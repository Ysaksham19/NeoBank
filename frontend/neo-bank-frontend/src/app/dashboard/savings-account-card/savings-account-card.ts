import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountStateService } from '../../core/services/account-state';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-savings-account-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './savings-account-card.html',
  styleUrls: ['./savings-account-card.css']
})
export class SavingsAccountCard implements OnInit {
  savingsAccount?: Account;
  loading = true;

  constructor(private accountState: AccountStateService) {}

  ngOnInit(): void {
    if (this.accountState.snapshot.length > 0) {
      this.setAccount(this.accountState.snapshot);
    } else {
      this.accountState.loadAccounts();
      this.accountState.accounts$.subscribe(accounts => {
        if (accounts.length > 0) this.setAccount(accounts);
      });
    }
  }

  private setAccount(accounts: Account[]): void {
    // FIX #6 — backend returns 'SAVINGS', not 'Savings Account'
    this.savingsAccount = accounts.find(a => a.accountType === 'SAVINGS');
    this.loading = false;
  }
}
