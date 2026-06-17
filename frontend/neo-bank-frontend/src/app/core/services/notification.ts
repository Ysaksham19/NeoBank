import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Notification } from '../../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private http: HttpClient
  ) {}

  getNotifications(): Observable<Notification[]> {

    return this.http.get<Notification[]>(
      // `${environment.apiUrl}/notifications`
      'http://localhost:8080/api/v1/notifications'
    );

  }

}