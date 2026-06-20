import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Analytics } from '../../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly BASE_URL = `${environment.apiUrl}/analytics`;
  constructor(private http: HttpClient) {}

  getMonthlySpending(): Observable<Analytics[]> {
    return this.http.get<Analytics[]>(`${this.BASE_URL}/monthly-spending`);
  }
}
