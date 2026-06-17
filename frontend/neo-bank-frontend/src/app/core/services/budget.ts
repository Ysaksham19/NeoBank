import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Budget } from '../../models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private readonly BASE_URL =
    'http://localhost:8080/api/v1/budgets';

  constructor(
    private http: HttpClient
  ) {}

  // CREATE BUDGET

  createBudget(payload: any): Observable<any> {

    return this.http.post(

      this.BASE_URL,

      payload

    );

  }

  // GET MY BUDGETS

  getMyBudgets(): Observable<Budget[]> {

    return this.http.get<Budget[]>(

      this.BASE_URL

    );

  }

  // DELETE BUDGET

  deleteBudget(id: number): Observable<any> {

    return this.http.delete(

      `${this.BASE_URL}/${id}`

    );

  }

}