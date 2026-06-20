import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Budget } from '../../models/budget.model';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private readonly BASE_URL = `${environment.apiUrl}/budgets`;
  constructor(private http: HttpClient) {}

  createBudget(payload: any): Observable<any> {
    return this.http.post(this.BASE_URL, payload);
  }

  getMyBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.BASE_URL);
  }

  deleteBudget(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }
}
