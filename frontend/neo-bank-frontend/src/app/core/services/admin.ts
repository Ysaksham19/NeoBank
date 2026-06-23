import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { AdminUser } from '../../models/admin-user.model';
import { AdminLoanApplication } from '../../models/admin-loan-application';
import { AdminAccount } from '../../models/admin-account.model';
import { AdminTransaction } from '../../models/admin-transaction.model';
// ─── Interfaces ───────────────────────────────────────────────



// ─── Service ──────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly BASE_URL = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // ── Users ────────────────────────────────────────────────────

  getAllUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.BASE_URL}/users`);
  }

  getUserById(userId: number): Observable<AdminUser> {
    return this.http.get<AdminUser>(`${this.BASE_URL}/users/${userId}`);
  }

  updateUserStatus(userId: number, status: string): Observable<AdminUser> {
    return this.http.put<AdminUser>(
      `${this.BASE_URL}/users/${userId}/status`,
      null,
      { params: { status } }
    );
  }

  updateKycStatus(userId: number, kycStatus: string): Observable<AdminUser> {
    return this.http.put<AdminUser>(
      `${this.BASE_URL}/kyc/${userId}/status`,
      null,
      { params: { kycStatus } }
    );
  }

  // ── Loans ────────────────────────────────────────────────────

  getAllLoanApplications(): Observable<AdminLoanApplication[]> {
    return this.http.get<AdminLoanApplication[]>(`${this.BASE_URL}/loans/applications`);
  }

    decideLoan(
    applicationId: number,
    payload: { decision: string; adminRemarks: string }
  ): Observable<string> {
    return this.http.put(
      `${this.BASE_URL}/loans/${applicationId}/decision`,
      payload,
      { responseType: 'text' }   // ✅ backend returns plain string, not JSON
    );
  }

  // ── Accounts ─────────────────────────────────────────────────

  getAllAccounts(): Observable<AdminAccount[]> {
    return this.http.get<AdminAccount[]>(`${this.BASE_URL}/accounts`);
  }

  updateAccountStatus(accountId: number, status: string): Observable<AdminAccount> {
    return this.http.put<AdminAccount>(
      `${this.BASE_URL}/accounts/${accountId}/status`,
      null,
      { params: { status } }
    );
  }

  // ── Transactions ─────────────────────────────────────────────

  getAllTransactions(): Observable<AdminTransaction[]> {
    return this.http.get<AdminTransaction[]>(`${this.BASE_URL}/transactions`);
  }
}