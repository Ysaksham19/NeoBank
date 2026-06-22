import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Bill } from '../../models/bill.model';

@Injectable({ providedIn: 'root' })
export class BillService {
  private readonly BASE_URL = `${environment.apiUrl}/bills`;

  constructor(private http: HttpClient) {}

  // ── Core CRUD ─────────────────────────────────────────────

  createBill(payload: any): Observable<Bill> {
    return this.http.post<Bill>(this.BASE_URL, payload);
  }

  getBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(this.BASE_URL);
  }

  getPendingBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.BASE_URL}/pending`);
  }

  // ✅ Server-filtered overdue bills (avoids full fetch + client-side filter)
  getOverdueBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.BASE_URL}/overdue`);
  }

  // PATCH not PUT — backend uses @PatchMapping("/pay/{id}")
  payBill(id: number): Observable<Bill> {
   return this.http.put<Bill>(`${this.BASE_URL}/pay/${id}`, {});
  }
  // responseType 'text' — backend returns plain string, not JSON
  deleteBill(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`, { responseType: 'text' });
  }
}