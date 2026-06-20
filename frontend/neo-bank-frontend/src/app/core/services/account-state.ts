import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AccountService } from './account';
import { Account } from '../../models/account.model';

/**
 * FIX #17 — single shared cache for account list so
 * TransferMoney, DepositMoney, and WithdrawMoney don't each
 * fire a separate HTTP call for the same data.
 */
@Injectable({ providedIn: 'root' })
export class AccountStateService {
  private accountsSubject = new BehaviorSubject<Account[]>([]);
  accounts$: Observable<Account[]> = this.accountsSubject.asObservable();

  constructor(private accountService: AccountService) {}

  loadAccounts(): void {
    this.accountService.getMyAccounts().subscribe({
      next: (accounts) => this.accountsSubject.next(accounts),
      error: (err) => console.error('Failed to load accounts', err)
    });
  }

  get snapshot(): Account[] {
    return this.accountsSubject.getValue();
  }
}
