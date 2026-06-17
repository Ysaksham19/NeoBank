import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Transaction } from '../../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private readonly BASE_URL =
    'http://localhost:8080/api/v1/transactions';

  constructor(
    private http: HttpClient
  ) {}

  // =====================================================
  // RECENT TRANSACTIONS
  // =====================================================

  getRecentTransactions(): Observable<Transaction[]> {

    return this.http.get<Transaction[]>(

      `${this.BASE_URL}/recent`

    );

  }

  // =====================================================
  // TRANSFER MONEY
  // =====================================================

  transferMoney(
    accountId: number,
    payload: any
  ): Observable<any> {

    return this.http.post(

      `${this.BASE_URL}/transfer/${accountId}`,

      payload

    );

  }

  // =====================================================
  // DEPOSIT MONEY
  // =====================================================

  depositMoney(
    accountId: number,
    amount: number,
    remarks: string
  ): Observable<any> {

    const params = new HttpParams()

      .set('amount', amount)

      .set('remarks', remarks);

    return this.http.post(

      `${this.BASE_URL}/deposit/${accountId}`,

      {},

      { params }

    );

  }

  // =====================================================
  // WITHDRAW MONEY
  // =====================================================

  withdrawMoney(
    accountId: number,
    amount: number,
    remarks: string
  ): Observable<any> {

    const params = new HttpParams()

      .set('amount', amount)

      .set('remarks', remarks);

    return this.http.post(

      `${this.BASE_URL}/withdraw/${accountId}`,

      {},

      { params }

    );

  }

}