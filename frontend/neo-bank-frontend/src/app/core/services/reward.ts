import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reward } from '../../models/reward.model';

@Injectable({ providedIn: 'root' })
export class RewardService {
  private readonly BASE_URL = `${environment.apiUrl}/rewards`;
  constructor(private http: HttpClient) {}

  getRewards(): Observable<Reward[]> {
    return this.http.get<Reward[]>(this.BASE_URL);
  }

  getTotalRewards(): Observable<number> {
    return this.http.get<number>(`${this.BASE_URL}/total`);
  }
}
