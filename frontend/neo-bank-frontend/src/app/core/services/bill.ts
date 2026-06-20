import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Bill } from '../../models/bill.model';

@Injectable({ providedIn: 'root' })
export class BillService {
  private readonly BASE_URL = `${environment.apiUrl}/bills`;
  constructor(private http: HttpClient) {}

  createBill(payload: any): Observable<any> {
    return this.http.post(this.BASE_URL, payload);
  }

  getBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(this.BASE_URL);
  }

  getPendingBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.BASE_URL}/pending`);
  }

  // FIX #4 — PATCH not PUT
  payBill(id: number): Observable<any> {
    return this.http.patch(`${this.BASE_URL}/pay/${id}`, {});
  }

  deleteBill(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }
}
