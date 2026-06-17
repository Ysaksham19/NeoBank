import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TotalBalance } from '../../models/total-balance.model';
import { Account } from '../../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient
  ) {}
  // total balance
  getTotalBalance(): Observable<TotalBalance> {

    return this.http.get<TotalBalance>(
      // `${environment.apiUrl}/accounts/total-balance`
      'http://localhost:8080/api/v1/accounts/total-balance'
    );

  }

  // account details
  getMyAccounts() {

  return this.http.get<Account[]>(
    // `${environment.apiUrl}/accounts/my-accounts`
    'http://localhost:8080/api/v1/accounts/my-accounts'
  );

}

}