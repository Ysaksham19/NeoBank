import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Analytics } from '../../models/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(
    private http: HttpClient
  ) {}

  getMonthlySpending(): Observable<Analytics[]> {

    return this.http.get<Analytics[]>(
      // `${environment.apiUrl}/analytics/monthly-spending`
      'http://localhost:8080/api/v1/analytics/monthly-spending'
    );

  }

}