import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/transactions`);
  }
}