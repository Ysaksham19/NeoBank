import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoanProduct } from '../../models/loan-product.model';

@Injectable({ providedIn: 'root' })
export class LoanService {

  // environment.apiUrl = 'http://localhost:8080/api/v1'

  // LoanProductController   → /api/v1/loans/products
  private readonly PRODUCTS_URL = `${environment.apiUrl}/loans/products`;

  // LoanApplicationController & LoanRepaymentController → /api/loans/...
  // Must strip /v1 → go up one level
  private readonly BASE_URL = `${environment.apiUrl.replace('/v1', '')}/loans`;

  // AdminLoanController → /api/v1/admin/loans/...
  private readonly ADMIN_URL = `${environment.apiUrl}/admin/loans`;

  constructor(private http: HttpClient) {}

  // ─── LOAN PRODUCTS ────────────────────────────────────────
  // GET /api/v1/loans/products
  getLoanProducts(): Observable<LoanProduct[]> {
    return this.http.get<LoanProduct[]>(this.PRODUCTS_URL);
  }

  // ─── USER — LOAN APPLICATIONS ─────────────────────────────
  // POST /api/loans/apply
  applyLoan(payload: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/apply`, payload);
  }

  // GET /api/loans/my-applications
  getMyApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/my-applications`);
  }

  // ─── USER — LOAN ACCOUNTS & REPAYMENTS ────────────────────
  // GET /api/loans/my-accounts
  getMyLoanAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/my-accounts`);
  }

  // GET /api/loans/{loanAccountId}/repayments
  getRepaymentSchedule(loanAccountId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/${loanAccountId}/repayments`);
  }

  // PATCH /api/loans/{loanAccountId}/repayments/{repaymentId}/pay
  markRepaymentAsPaid(loanAccountId: number, repaymentId: number): Observable<any> {
    return this.http.patch(
      `${this.BASE_URL}/${loanAccountId}/repayments/${repaymentId}/pay`, {}
    );
  }

  // ─── ADMIN ────────────────────────────────────────────────
  // GET /api/v1/admin/loans/applications
  getAllApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.ADMIN_URL}/applications`);
  }

  // PUT /api/v1/admin/loans/{applicationId}/decision
  decideLoan(applicationId: number, payload: any): Observable<any> {
    return this.http.put(`${this.ADMIN_URL}/${applicationId}/decision`, payload);
  }
}