// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable, map } from 'rxjs';
// import { environment } from '../../../environments/environment';
// import { Transaction } from '../../models/transaction.model';

// @Injectable({ providedIn: 'root' })
// export class TransactionService {
//   private readonly BASE_URL = `${environment.apiUrl}/transactions`;

//   constructor(private http: HttpClient) {}

//   // ── GET all transactions for an account ──────────────────────────
//   getAllTransactions(accountId: number): Observable<Transaction[]> {
//     return this.http
//       .get<any>(`${this.BASE_URL}/${accountId}`)
//       .pipe(map(res => this.normaliseList(res)));
//   }

//   // ── GET paginated transactions ────────────────────────────────────
//   getMyTransactions(accountId: number, page = 0, size = 10): Observable<Transaction[]> {
//     const params = new HttpParams()
//       .set('page', page.toString())
//       .set('size', size.toString());
//     return this.http
//       .get<any>(`${this.BASE_URL}/paginated/${accountId}`, { params })
//       .pipe(map(res => this.normaliseList(res)));
//   }

//   // ── MINI STATEMENT (last 5 transactions) ─────────────────────────
//   getMiniStatement(accountId: number): Observable<Transaction[]> {
//     return this.http
//       .get<any>(`${this.BASE_URL}/mini-statement/${accountId}`)
//       .pipe(map(res => this.normaliseList(res)));
//   }

//   // ── DEPOSIT ───────────────────────────────────────────────────────
//   depositMoney(accountId: number, amount: number, remarks: string): Observable<any> {
//     const params = new HttpParams()
//       .set('amount', amount.toString())
//       .set('remarks', remarks ?? '');
//     return this.http.post(
//       `${this.BASE_URL}/deposit/${accountId}`,
//       null,
//       { params }
//     );
//   }

//   // ── WITHDRAW ──────────────────────────────────────────────────────
//   withdrawMoney(accountId: number, amount: number, remarks: string): Observable<any> {
//     const params = new HttpParams()
//       .set('amount', amount.toString())
//       .set('remarks', remarks ?? '');
//     return this.http.post(
//       `${this.BASE_URL}/withdraw/${accountId}`,
//       null,
//       { params }
//     );
//   }

//   // ── TRANSFER ──────────────────────────────────────────────────────
//   transferMoney(accountId: number, payload: {
//     receiverAccountNo: string;
//     amount: number;
//     remarks: string;
//   }): Observable<any> {
//     return this.http.post(
//       `${this.BASE_URL}/transfer/${accountId}`,
//       payload
//     );
//   }

//   // ── Normalise list (array OR paginated { content: [] }) ───────────
//   private normaliseList(res: any): Transaction[] {
//     const list: any[] = Array.isArray(res)
//       ? res
//       : (res?.content ?? res?.data ?? res?.transactions ?? []);
//     return list.map(t => this.normalise(t));
//   }

//   // ── Normalise single transaction ──────────────────────────────────
//   private normalise(t: any): Transaction {
//     const account = t.account ?? {};
//     const user    = account.user ?? {};

//     return {
//       id:              t.id               ?? 0,
//       transactionRef:  t.transactionRef   ?? t.txnRef          ?? t.ref      ?? '',
//       transactionType: t.transactionType  ?? t.type            ?? t.txnType  ?? '',
//       amount:          t.amount           ?? t.txnAmount       ?? 0,
//       balanceAfter:    t.balanceAfter     ?? t.availableBalanceAfter
//                                           ?? t.closingBalance  ?? t.balance  ?? 0,
//       remarks:         t.remarks          ?? t.description     ?? t.narration ?? '',
//       status:          t.status           ?? 'SUCCESS',
//       createdAt:       t.createdAt        ?? t.transactionDate ?? t.date     ?? '',
//       accountNo:       account.accountNo  ?? account.accountNumber
//                                           ?? t.accountNo       ?? '',
//       accountId:       account.id         ?? t.accountId       ?? 0,
//       customerName:    user.fullName      ?? user.name         ?? t.customerName ?? ''
//     };
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Transaction } from '../../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly BASE_URL = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  // ── GET all transactions for an account ──────────────────────────
  getAllTransactions(accountId: number): Observable<Transaction[]> {
    return this.http
      .get<any>(`${this.BASE_URL}/${accountId}`)
      .pipe(map(res => this.normaliseList(res)));
  }

  // ── GET paginated transactions ────────────────────────────────────
  getMyTransactions(accountId: number, page = 0, size = 10): Observable<Transaction[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http
      .get<any>(`${this.BASE_URL}/paginated/${accountId}`, { params })
      .pipe(map(res => this.normaliseList(res)));
  }

  // ── MINI STATEMENT ────────────────────────────────────────────────
  getMiniStatement(accountId: number): Observable<Transaction[]> {
    return this.http
      .get<any>(`${this.BASE_URL}/mini-statement/${accountId}`)
      .pipe(map(res => this.normaliseList(res)));
  }

  // ── DEPOSIT ───────────────────────────────────────────────────────
  depositMoney(accountId: number, amount: number, remarks: string): Observable<any> {
    const params = new HttpParams()
      .set('amount', amount.toString())
      .set('remarks', remarks ?? '');
    return this.http.post(
      `${this.BASE_URL}/deposit/${accountId}`,
      null,
      { params }
    );
  }

  // ── WITHDRAW ──────────────────────────────────────────────────────
  withdrawMoney(accountId: number, amount: number, remarks: string): Observable<any> {
    const params = new HttpParams()
      .set('amount', amount.toString())
      .set('remarks', remarks ?? '');
    return this.http.post(
      `${this.BASE_URL}/withdraw/${accountId}`,
      null,
      { params }
    );
  }

  // ── TRANSFER ──────────────────────────────────────────────────────
  transferMoney(accountId: number, payload: {
    receiverAccountNo: string;
    amount: number;
    remarks: string;
  }): Observable<any> {
    return this.http.post(
      `${this.BASE_URL}/transfer/${accountId}`,
      payload
    );
  }

  // ── Normalise list ────────────────────────────────────────────────
  private normaliseList(res: any): Transaction[] {
    const list: any[] = Array.isArray(res)
      ? res
      : (res?.content ?? res?.data ?? res?.transactions ?? []);
    return list.map(t => {
      try { return this.normalise(t); }
      catch (e) { console.error('normalise() failed:', t, e); return null; }
    }).filter((t): t is Transaction => t !== null);
  }

  // ── Normalise single transaction ──────────────────────────────────
  private normalise(t: any): Transaction {
    const account = t.account ?? {};
    const user    = account.user ?? {};

    return {
      id:                   t.id                    ?? 0,
      transactionRef:       t.transactionRef        ?? t.txnRef   ?? t.ref   ?? '',
      transactionType:      t.transactionType       ?? t.type     ?? t.txnType ?? '',
      transactionStatus:    t.transactionStatus     ?? t.status   ?? 'SUCCESS',
      amount:               t.amount                ?? t.txnAmount ?? 0,
      availableBalanceAfter: t.availableBalanceAfter ?? t.balanceAfter
                                                     ?? t.closingBalance ?? t.balance ?? 0,
      ledgerBalanceAfter:   t.ledgerBalanceAfter    ?? t.availableBalanceAfter ?? 0,
      remarks:              t.remarks               ?? t.description ?? t.narration ?? '',
      createdAt:            t.createdAt             ?? t.transactionDate ?? t.date ?? '',
      accountId:            t.accountId             ?? 0,
      accountNo:            t.accountNo             ?? '',
      receiverAccountId:    t.receiverAccountId     ?? null,
      receiverAccountNo:    t.receiverAccountNo     ?? null,
    };
  }
}
