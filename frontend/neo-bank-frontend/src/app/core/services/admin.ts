import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminUser } from '../../models/admin-user.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly BASE_URL = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.BASE_URL}/users`);
  }

  getUserById(userId: number): Observable<AdminUser> {
    return this.http.get<AdminUser>(`${this.BASE_URL}/users/${userId}`);
  }

  updateUserStatus(userId: number, status: string): Observable<AdminUser> {
    return this.http.put<AdminUser>(
      `${this.BASE_URL}/users/${userId}/status?status=${status}`,
      {}
    );
  }

  getAllTransactions(): Observable<AdminTransaction[]> {
    return this.http.get<AdminTransaction[]>(`${this.BASE_URL}/transactions`);
  }
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