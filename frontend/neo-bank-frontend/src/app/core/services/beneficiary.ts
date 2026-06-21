import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Beneficiary,
  AddBeneficiaryRequest,
  EditBeneficiaryRequest
} from '../../models/beneficiary.model';

@Injectable({ providedIn: 'root' })
export class BeneficiaryService {
  private readonly BASE_URL = `${environment.apiUrl}/beneficiaries`;

  constructor(private http: HttpClient) {}

  // ── Fetch ──────────────────────────────────────────────────────────
  getAll(): Observable<Beneficiary[]> {
    return this.http.get<Beneficiary[]>(this.BASE_URL);
  }

  getById(id: number): Observable<Beneficiary> {
    return this.http.get<Beneficiary>(`${this.BASE_URL}/${id}`);
  }

  // ── CRUD ───────────────────────────────────────────────────────────
  add(payload: AddBeneficiaryRequest): Observable<Beneficiary> {
    return this.http.post<Beneficiary>(this.BASE_URL, payload);
  }

  edit(id: number, payload: EditBeneficiaryRequest): Observable<Beneficiary> {
    return this.http.put<Beneficiary>(`${this.BASE_URL}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // ── Favourite toggle ───────────────────────────────────────────────
  toggleFavorite(id: number): Observable<Beneficiary> {
    return this.http.patch<Beneficiary>(`${this.BASE_URL}/${id}/favorite`, {});
  }

  // ── Block / Unblock ────────────────────────────────────────────────
  block(id: number): Observable<Beneficiary> {
    return this.http.patch<Beneficiary>(`${this.BASE_URL}/${id}/block`, {});
  }

  unblock(id: number): Observable<Beneficiary> {
    return this.http.patch<Beneficiary>(`${this.BASE_URL}/${id}/unblock`, {});
  }
}