import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FinancialInsights } from '../../models/insights.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InsightsService {

  private base = `${environment.apiUrl}/api/insights`;

  constructor(private http: HttpClient) {}

  getInsights(userId: number): Observable<FinancialInsights> {
    return this.http.get<FinancialInsights>(`${this.base}/${userId}`);
  }
}