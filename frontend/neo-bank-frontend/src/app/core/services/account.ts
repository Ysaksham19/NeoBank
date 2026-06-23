import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TotalBalance } from '../../models/total-balance.model';
import { Account } from '../../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly BASE_URL  = `${environment.apiUrl}/accounts`;
  private readonly BRANCH_URL = `${environment.apiUrl}/branches`;

  constructor(private http: HttpClient) {}

  getTotalBalance(): Observable<TotalBalance> {
    return this.http.get<TotalBalance>(`${this.BASE_URL}/total-balance`);
  }

  getMyAccounts(): Observable<Account[]> {
    return this.http.get<any[]>(`${this.BASE_URL}`).pipe(
      map(accounts => accounts.map(a => this.normalise(a)))
    );
  }

  getAccountById(id: number): Observable<Account> {
    return this.http.get<any>(`${this.BASE_URL}/${id}`).pipe(
      map(a => this.normalise(a))
    );
  }

  getBranches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BRANCH_URL}`).pipe(
      catchError(() => of([{ id: 1, name: 'Main Branch', code: 'MB001', ifscCode: 'NEO0000001' }]))
    );
  }

  createAccount(payload: { accountType: string; branchId: number }): Observable<Account> {
    return this.http.post<any>(`${this.BASE_URL}`, payload).pipe(
      map(a => this.normalise(a))
    );
  }

  private normalise(a: any): Account {
    return {
      id:               a.id               ?? a.accountId        ?? 0,
      accountNumber:    a.accountNumber     ?? a.accountNo        ?? a.account_number ?? '',
      accountType:      a.accountType       ?? a.type             ?? a.account_type   ?? '',
      status:           a.status            ?? a.accountStatus    ?? 'ACTIVE',
      availableBalance: a.availableBalance  ?? a.available_balance ?? a.balance       ?? 0,
      ledgerBalance:    a.ledgerBalance     ?? a.ledger_balance   ?? a.balance        ?? 0,
      ifscCode:         a.ifscCode          ?? a.ifsc_code        ?? a.ifsc           ?? '',
      branchName:       a.branchName        ?? a.branch_name      ?? a.branch         ?? '',
      branchCode:       a.branchCode        ?? a.branch_code      ?? '',
      currency:         a.currency          ?? 'INR',
      createdAt:        a.createdAt         ?? a.created_at       ?? a.openedAt       ?? ''
    };
  }
}