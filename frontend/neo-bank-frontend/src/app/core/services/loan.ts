import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoanProduct } from '../../models/loan-product.model';

@Injectable({ providedIn: 'root' })
export class LoanService {

  private readonly PRODUCTS_URL = `${environment.apiUrl}/loans/products`;
  private readonly BASE_URL     = `${environment.apiUrl.replace('/v1', '')}/loans`;
  private readonly ADMIN_URL    = `${environment.apiUrl}/admin/loans`;

  constructor(private http: HttpClient) {}

  // ─── LOAN PRODUCTS ────────────────────────────────────────
  getLoanProducts(): Observable<LoanProduct[]> {
    return this.http.get<LoanProduct[]>(this.PRODUCTS_URL);
  }

  // ─── USER — LOAN APPLICATIONS ─────────────────────────────
  applyLoan(payload: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/apply`, payload);
  }

  getMyApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/my-applications`);
  }

  // ─── USER — LOAN ACCOUNTS & REPAYMENTS ────────────────────
  getMyLoanAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/my-accounts`);
  }

  getRepaymentSchedule(loanAccountId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/${loanAccountId}/repayments`);
  }

  markRepaymentAsPaid(loanAccountId: number, repaymentId: number): Observable<string> {
    return this.http.patch(
      `${this.BASE_URL}/${loanAccountId}/repayments/${repaymentId}/pay`,
      {},
      { responseType: 'text' }   // ✅ FIXED: backend returns plain String, not JSON
    );
  }

  // ─── ADMIN ────────────────────────────────────────────────
  getAllApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.ADMIN_URL}/applications`);
  }

  decideLoan(applicationId: number, payload: any): Observable<string> {
    return this.http.put(
      `${this.ADMIN_URL}/${applicationId}/decision`,
      payload,
      { responseType: 'text' }   // ✅ already fixed earlier — kept here
    );
  }
}