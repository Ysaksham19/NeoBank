import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
// ← REMOVED: import { AdminUser } from '../../models/admin-user.model'
//   AdminUser is now defined inline below — no external model needed


// ─── Interfaces ───────────────────────────────────────────────

export interface AdminUser {
  id: number;
  customerNo: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  kycStatus: string;
  createdAt: string;
}

export interface AdminLoanApplication {
  id: number;
  customerNo: string;
  customerName: string;
  loanProductName: string;
  requestedAmount: number;
  tenure: number;
  status: string;
  adminRemarks: string | null;
  createdAt: string;
}

export interface AdminAccount {
  id: number;
  accountNo: string;
  customerNo: string;
  customerName: string;
  accountType: string;
  currency: string;
  availableBalance: number;
  ledgerBalance: number;
  status: string;
  createdAt: string;
}

export interface AdminTransaction {
  id: number;
  transactionRef: string;
  customerNo: string | null;
  customerName: string | null;
  senderAccountNo: string | null;
  receiverAccountNo: string | null;
  transactionType: string;
  transactionStatus: string;
  amount: number;
  availableBalanceAfter: number;
  ledgerBalanceAfter: number;
  remarks: string | null;
  createdAt: string;
}


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
    return this.http.put<string>(
      `${this.BASE_URL}/loans/${applicationId}/decision`,
      payload
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