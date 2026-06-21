import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationService } from '../../core/services/notification';
import { NotifItem } from '../../models/notification.model';

@Component({
  selector: 'app-notifications-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-panel.html',
  styleUrls: ['./notifications-panel.css']
})
export class NotificationsPanel implements OnInit {

  notifications: NotifItem[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.getNotifications().subscribe({
      next: (response: NotifItem[]) => {
        this.notifications = response;
      },
      error: (err: unknown) => {
        console.error('Failed to load notifications', err);    // ← matches the parameter
}
    });
  }
}