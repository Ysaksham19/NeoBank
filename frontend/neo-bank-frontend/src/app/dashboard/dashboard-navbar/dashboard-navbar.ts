import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth';
import { NotificationService } from '../../core/services/notification';
import { AppNotification } from '../../models/notification.model';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-navbar.html',
  styleUrls: ['./dashboard-navbar.css']
})
export class DashboardNavbar implements OnInit {

  user: any;

  notifications: AppNotification[] = [];

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {

    this.user = this.authService.getCurrentUser();

    this.notificationService
      .getNotifications()
      .subscribe({

        next: (response) => {

          this.notifications = response;

        }

      });

  }

}