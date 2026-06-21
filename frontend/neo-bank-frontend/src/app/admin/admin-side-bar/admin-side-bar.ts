import { Component, inject, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth';
import { AdminService } from '../../core/services/admin';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-side-bar.html',
  styleUrl: './admin-side-bar.css',
})
export class AdminSidebar implements OnInit {

  private readonly authService  = inject(AuthService);
  private readonly adminService = inject(AdminService);

  collapsed  = false;
  mobileOpen = false;

  pendingKycCount  = 0;
  pendingLoanCount = 0;

  @Output() collapsedChange = new EventEmitter<boolean>();

  // ── Admin identity ────────────────────────────────────────
  get adminName(): string {
    return this.authService.getCurrentUser()?.fullName?.split(' ')[0] || 'Admin';
  }

  ngOnInit(): void {
    this.loadBadgeCounts();
    const saved = localStorage.getItem('as_collapsed');
    if (saved !== null) {
      this.collapsed = saved === 'true';
      this.collapsedChange.emit(this.collapsed);
    }
  }

  loadBadgeCounts(): void {
    forkJoin({
      users: this.adminService.getAllUsers().pipe(catchError(() => of([]))),
      loans: this.adminService.getAllLoanApplications().pipe(catchError(() => of([])))
    }).subscribe(({ users, loans }) => {
      this.pendingKycCount  = (users as any[]).filter(u => u.kycStatus === 'PENDING').length;
      this.pendingLoanCount = (loans as any[]).filter(l => l.status   === 'PENDING').length;
    });
  }

  toggle(): void {
    this.collapsed = !this.collapsed;
    localStorage.setItem('as_collapsed', String(this.collapsed));
    this.collapsedChange.emit(this.collapsed);
  }

  openMobile():  void { this.mobileOpen = true; }
  closeMobile(): void { this.mobileOpen = false; }

  logout(): void { this.authService.logout(); }

  @HostListener('document:keydown.escape')
  onEsc(): void { this.mobileOpen = false; }
}