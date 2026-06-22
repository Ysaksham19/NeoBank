import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { NotificationService } from '../../core/services/notification';
import { NotifItem } from '../../models/notification.model';

import { Location } from '@angular/common';
import { AdminService } from '../../core/services/admin';

@Component({
  selector: 'app-notifications-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-panel.html',
  styleUrls: ['./notifications-panel.css']
})
export class NotificationsPanel implements OnInit, OnDestroy {

  notifications: NotifItem[] = [];
  loading       = false;
  errorMessage  = '';

  private destroy$ = new Subject<void>();

  constructor(
    private notificationService: NotificationService,
    private adminService: AdminService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.notificationService.getNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: NotifItem[]) => {
          this.notifications = response;
          this.loading       = false;
        },
        error: (err: unknown) => {
          console.error('Failed to load notifications', err);
          this.errorMessage = 'Could not load notifications.';
          this.loading      = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Computed ──────────────────────────────────────────
  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // ── Helpers ───────────────────────────────────────────
  getIcon(type?: string): string {
    const map: Record<string, string> = {
      TRANSFER: '💸', BILL: '🧾', CASHBACK: '🎁',
      LOAN:     '📋', KYC: '🪪',  ACCOUNT:  '🏦', SYSTEM: '🔔',
    };
    return map[type ?? 'SYSTEM'] ?? '🔔';
  }

  // ── Actions ───────────────────────────────────────────
  markRead(n: NotifItem): void {
    if (n.read) return;
    this.notificationService.markRead(n.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          const i = this.notifications.findIndex(x => x.id === updated.id);
          if (i !== -1) this.notifications[i] = updated;
        },
        error: () => {
          const i = this.notifications.findIndex(x => x.id === n.id);
          if (i !== -1) this.notifications[i] = { ...this.notifications[i], read: true };
        }
      });
  }

  markAllRead(): void {
    this.notificationService.markAllRead()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list) => { this.notifications = list; },
        error: () => {
          this.notifications = this.notifications.map(n => ({ ...n, read: true }));
        }
      });
  }

  deleteNotif(n: NotifItem, e: Event): void {
    e.stopPropagation();
    this.notificationService.delete(n.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notifications = this.notifications.filter(x => x.id !== n.id);
        },
        error: () => {}
      });
  }

  goBack(): void {
  this.location.back();
}
}