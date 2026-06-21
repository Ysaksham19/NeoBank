import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Budget } from '../../models/budget.model';

@Injectable({ providedIn: 'root' })
export class BudgetService {

  private readonly BASE_URL = `${environment.apiUrl}/budgets`;

  constructor(private http: HttpClient) {}

  // ── Core CRUD ─────────────────────────────────────────────

  createBudget(payload: any): Observable<Budget> {
    return this.http.post<Budget>(this.BASE_URL, payload);
  }

  getMyBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.BASE_URL);
  }

  updateBudget(id: number, payload: any): Observable<Budget> {
    return this.http.put<Budget>(`${this.BASE_URL}/${id}`, payload);
  }

  // responseType 'text' — backend returns plain string body (not JSON)
  deleteBudget(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`, { responseType: 'text' });
  }

  // ── Summary & Alerts ──────────────────────────────────────

  getBudgetSummary(userId: number, month: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/summary/${userId}?month=${month}`);
  }

  getBudgetAlerts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/alerts`);
  }

  // ── Utilities ─────────────────────────────────────────────

  copyLastMonth(): Observable<Budget[]> {
    return this.http.post<Budget[]>(`${this.BASE_URL}/copy-last-month`, {});
  }

  getBudgetHistory(months: number = 3): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/history?months=${months}`);
  }
}