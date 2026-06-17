import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationService } from '../../core/services/notification';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-notifications-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-panel.html',
  styleUrls: ['./notifications-panel.css']
})
export class NotificationsPanel implements OnInit {

  notifications: Notification[] = [];

  constructor(
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {

    this.notificationService
      .getNotifications()
      .subscribe({

        next: (response) => {

          this.notifications = response;

        },

        error: (error) => {

          console.error(
            'Failed to load notifications',
            error
          );

        }

      });

  }

}