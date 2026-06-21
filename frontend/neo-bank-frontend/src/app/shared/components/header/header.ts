import {
  Component, ElementRef, HostListener, inject, OnInit, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, interval, takeUntil } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

import { AuthService }         from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification';
import { NotifItem }           from '../../../models/notification.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {

  private readonly authService   = inject(AuthService);
  private readonly notifService  = inject(NotificationService);
  private readonly router        = inject(Router);
  private readonly elRef         = inject(ElementRef);
  private readonly destroy$      = new Subject<void>();

  notifOpen       = false;
  profileOpen     = false;
  mobileMenuOpen  = false;
  isScrolled      = false;

  notifications: NotifItem[] = [];
  notifLoading    = false;
  notifError      = '';

  // ── Lifecycle ────────────────────────────────────────────
  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.startPolling();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Poll every 30 s, immediately on first load ─────────
  private startPolling(): void {
    interval(30_000).pipe(
      startWith(0),
      switchMap(() => {
        this.notifLoading = true;
        this.notifError   = '';
        return this.notifService.getAll();
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (list) => {
        this.notifications = list;
        this.notifLoading  = false;
      },
      error: (err) => {
        this.notifError   = err?.error?.message ?? 'Could not load notifications.';
        this.notifLoading = false;
      }
    });
  }

  // ── User helpers ──────────────────────────────────────
  private get user() { return this.authService.getCurrentUser(); }

  get fullName():      string { return this.user?.fullName      || 'User'; }
  get userEmail():     string { return this.user?.email         || '—'; }
  get userName():      string { return this.fullName.split(' ')[0]; }
  get userInitial():   string { return this.fullName.charAt(0).toUpperCase(); }
  get customerNo():    string { return this.user?.customerNo    || this.user?.accountNumber || ''; }
  get accountStatus(): string { return this.user?.status        || 'PENDING'; }
  get kycStatus():     string { return this.user?.kycStatus     || 'PENDING'; }
  get unreadCount():   number { return this.notifications.filter(n => !n.read).length; }

  isLoggedIn(): boolean { return this.authService.isLoggedIn(); }
  isAdmin():    boolean { return this.user?.role === 'ADMIN'; }

  // ── Toggles ──────────────────────────────────────────
  toggleNotif(e: Event): void {
    e.stopPropagation();
    this.notifOpen      = !this.notifOpen;
    this.profileOpen    = false;
    this.mobileMenuOpen = false;
  }

  toggleProfile(e: Event): void {
    e.stopPropagation();
    this.profileOpen    = !this.profileOpen;
    this.notifOpen      = false;
    this.mobileMenuOpen = false;
  }

  toggleMobileMenu(e: Event): void {
    e.stopPropagation();
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.notifOpen      = false;
    this.profileOpen    = false;
  }

  // ── Notification actions ─────────────────────────────
  markAllRead(): void {
    this.notifService.markAllRead().pipe(takeUntil(this.destroy$)).subscribe({
      next: (list) => { this.notifications = list; },
      error: () => {
        // Optimistic fallback
        this.notifications = this.notifications.map(n => ({ ...n, read: true }));
      }
    });
  }

  markOneRead(n: NotifItem, e: Event): void {
    e.stopPropagation();
    if (n.read) return;
    this.notifService.markRead(n.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (updated) => {
        const idx = this.notifications.findIndex(x => x.id === updated.id);
        if (idx !== -1) this.notifications[idx] = updated;
      },
      error: () => {
        // Optimistic fallback
        const idx = this.notifications.findIndex(x => x.id === n.id);
        if (idx !== -1) this.notifications[idx] = { ...this.notifications[idx], read: true };
      }
    });
  }

  deleteNotif(n: NotifItem, e: Event): void {
    e.stopPropagation();
    this.notifService.delete(n.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => { this.notifications = this.notifications.filter(x => x.id !== n.id); },
      error: () => {}
    });
  }

  // ── Misc ─────────────────────────────────────────────
  closeAll(): void {
    this.profileOpen    = false;
    this.notifOpen      = false;
    this.mobileMenuOpen = false;
  }

  logout(): void {
    this.closeAll();
    this.authService.logout();
  }

  trackByNotif(_: number, n: NotifItem): number { return n.id; }

  // ── Global listeners ─────────────────────────────────
  @HostListener('window:scroll')
  onScroll(): void { this.isScrolled = window.scrollY > 8; }

  @HostListener('document:click', ['$event'])
  onOutsideClick(e: Event): void {
    if (!this.elRef.nativeElement.contains(e.target)) this.closeAll();
  }

  getNotifIcon(type?: string): string {
  const icons: Record<string, string> = {
    TRANSFER: '💸',
    BILL:     '🧾',
    CASHBACK: '🎁',
    LOAN:     '📋',
    KYC:      '🪪',
    ACCOUNT:  '🏦',
    SYSTEM:   '🔔',
  };
  return icons[type ?? 'SYSTEM'] ?? '🔔';
}
}