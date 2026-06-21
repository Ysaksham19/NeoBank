import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotifItem } from '../../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly BASE = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<NotifItem[]> {
    return this.http.get<NotifItem[]>(this.BASE);
  }

  // ← alias so older components still compile
  getNotifications(): Observable<NotifItem[]> {
    return this.getAll();
  }

  markRead(id: number): Observable<NotifItem> {
    return this.http.patch<NotifItem>(`${this.BASE}/${id}/read`, {});
  }

  markAllRead(): Observable<NotifItem[]> {
    return this.http.patch<NotifItem[]>(`${this.BASE}/mark-all-read`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${id}`);
  }
}