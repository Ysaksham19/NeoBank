import {
  Component, ElementRef, HostListener, inject, OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

interface NotifItem {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly router      = inject(Router);
  private readonly elRef       = inject(ElementRef);

  notifOpen   = false;
  profileOpen = false;
  isScrolled  = false;

  // ── Notifications (replace with API call when ready) ──────
  notifications: NotifItem[] = [
    { id: 1, title: 'Transfer Received',  message: 'You received ₹10,000 from Rohit S.',     time: '2 mins ago',  read: false },
    { id: 2, title: 'Bill Due',           message: 'Electricity bill ₹1,420 due in 3 days.',  time: '1 hour ago',  read: false },
    { id: 3, title: 'Cashback Reward',    message: '₹250 cashback credited to your wallet.',  time: '5 hours ago', read: true  },
  ];

  ngOnInit(): void {}

  // ── User data (reads live from localStorage via AuthService) ─
  private get user() { return this.authService.getCurrentUser(); }

  get fullName():      string { return this.user?.fullName  || 'User'; }
  get userEmail():     string { return this.user?.email     || '—'; }
  get userName():      string { return this.fullName.split(' ')[0]; }
  get userInitial():   string { return this.fullName.charAt(0).toUpperCase(); }
  get customerNo():    string { return this.user?.customerNo || this.user?.accountNumber || ''; }
  get accountStatus(): string { return this.user?.status    || 'PENDING'; }
  get kycStatus():     string { return this.user?.kycStatus || 'PENDING'; }
  get unreadCount():   number { return this.notifications.filter(n => !n.read).length; }

  isLoggedIn(): boolean { return this.authService.isLoggedIn(); }
  isAdmin():    boolean { return this.user?.role === 'ADMIN'; }

  // ── Toggle handlers ───────────────────────────────────────
  toggleNotif(e: Event): void {
    e.stopPropagation();
    this.notifOpen   = !this.notifOpen;
    this.profileOpen = false;
  }

  toggleProfile(e: Event): void {
    e.stopPropagation();
    this.profileOpen = !this.profileOpen;
    this.notifOpen   = false;
  }

  markAllRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
  }

  closeAll(): void {
    this.profileOpen = false;
    this.notifOpen   = false;
  }

  logout(): void {
    this.closeAll();
    this.authService.logout();
  }

  // ── Global listeners ──────────────────────────────────────
  @HostListener('window:scroll')
  onScroll(): void { this.isScrolled = window.scrollY > 8; }

  @HostListener('document:click', ['$event'])
  onOutsideClick(e: Event): void {
    if (!this.elRef.nativeElement.contains(e.target)) this.closeAll();
  }
}