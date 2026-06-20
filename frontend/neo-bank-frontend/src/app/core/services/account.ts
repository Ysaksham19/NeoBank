import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TotalBalance } from '../../models/total-balance.model';
import { Account } from '../../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly BASE_URL = `${environment.apiUrl}/accounts`;
  constructor(private http: HttpClient) {}

  getTotalBalance(): Observable<TotalBalance> {
    return this.http.get<TotalBalance>(`${this.BASE_URL}/total-balance`);
  }

  getMyAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.BASE_URL}/my-accounts`);
  }

  getAccountById(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.BASE_URL}/${id}`);
  }
}
