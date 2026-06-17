import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AdminUser } from '../../models/admin-user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly BASE_URL =
    'http://localhost:8080/api/v1/admin';

  constructor(
    private http: HttpClient
  ) {}

  getAllUsers(): Observable<AdminUser[]> {

    return this.http.get<AdminUser[]>(

      `${this.BASE_URL}/users`

    );

  }

  getUserById(userId: number) {

    return this.http.get<AdminUser>(

      `${this.BASE_URL}/users/${userId}`

    );

  }

  updateUserStatus(
    userId: number,
    status: string
  ) {

    return this.http.put<AdminUser>(

      `${this.BASE_URL}/users/${userId}/status?status=${status}`,

      {}

    );

  }

}