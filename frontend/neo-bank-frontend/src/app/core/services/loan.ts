import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoanProduct } from '../../models/loan-product.model';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private readonly BASE_URL = `${environment.apiUrl}/loans`;
  constructor(private http: HttpClient) {}

  getLoanProducts(): Observable<LoanProduct[]> {
    return this.http.get<LoanProduct[]>(`${this.BASE_URL}/products`);
  }

  applyLoan(payload: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/apply`, payload);
  }

  // FIX #10 — added missing method
  getMyApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/my-applications`);
  }

  getMyLoanAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/my-accounts`);
  }

  getRepaymentSchedule(loanAccountId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/${loanAccountId}/repayments`);
  }

  markRepaymentAsPaid(loanAccountId: number, repaymentId: number): Observable<any> {
    return this.http.patch(`${this.BASE_URL}/${loanAccountId}/repayments/${repaymentId}/pay`, {});
  }

  getAllApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/admin/applications`);
  }

  // FIX #5 — PUT not POST
  decideLoan(applicationId: number, payload: any): Observable<any> {
    return this.http.put(`${this.BASE_URL}/${applicationId}/decision`, payload);
  }
}
