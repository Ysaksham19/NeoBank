import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Transaction } from '../../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly BASE_URL = `${environment.apiUrl}/transactions`;
  constructor(private http: HttpClient) {}

  // FIX #3 — uses correct endpoint with accountId
  getMiniStatement(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.BASE_URL}/mini-statement/${accountId}`);
  }

  getAllTransactions(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.BASE_URL}/${accountId}`);
  }

  transferMoney(accountId: number, payload: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/transfer/${accountId}`, payload);
  }

  depositMoney(accountId: number, amount: number, remarks: string): Observable<any> {
    const params = new HttpParams().set('amount', amount).set('remarks', remarks);
    return this.http.post(`${this.BASE_URL}/deposit/${accountId}`, {}, { params });
  }

  withdrawMoney(accountId: number, amount: number, remarks: string): Observable<any> {
    const params = new HttpParams().set('amount', amount).set('remarks', remarks);
    return this.http.post(`${this.BASE_URL}/withdraw/${accountId}`, {}, { params });
  }
}
