import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountService } from './account';
import { Account } from '../../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountStateService {
  private accountsSubject = new BehaviorSubject<Account[]>([]);
  accounts$: Observable<Account[]> = this.accountsSubject.asObservable();

  private _loading = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this._loading.asObservable();

  constructor(private accountService: AccountService) {}

  loadAccounts(): void {
    this._loading.next(true);
    this.accountService.getMyAccounts().subscribe({
      next: (accounts) => {
        this.accountsSubject.next(accounts);
        this._loading.next(false);
      },
      error: (err) => {
        console.error('Failed to load accounts', err);
        this._loading.next(false);
      }
    });
  }

  get snapshot(): Account[] {
    return this.accountsSubject.getValue();
  }

  clear(): void {
    this.accountsSubject.next([]);
  }
}