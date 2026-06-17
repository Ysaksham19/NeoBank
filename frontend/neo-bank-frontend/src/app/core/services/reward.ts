import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Reward } from '../../models/reward.model';

@Injectable({
  providedIn: 'root'
})
export class RewardService {

  private readonly BASE_URL =
    'http://localhost:8080/api/v1/rewards';

  constructor(
    private http: HttpClient
  ) {}

  getRewards(): Observable<Reward[]> {

    return this.http.get<Reward[]>(

      this.BASE_URL

    );

  }

  getTotalRewards(): Observable<number> {

    return this.http.get<number>(

      `${this.BASE_URL}/total`

    );

  }

}