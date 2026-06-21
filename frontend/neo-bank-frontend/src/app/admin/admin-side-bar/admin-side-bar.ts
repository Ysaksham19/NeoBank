import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLinkActive } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth';
import { AdminService } from '../../core/services/admin';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLinkActive],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar implements OnInit {

  private readonly authService  = inject(AuthService);
  private readonly adminService = inject(AdminService);
  private readonly router       = inject(Router);

  collapsed   = false;   // desktop collapse
  mobileOpen  = false;   // mobile drawer open

  pendingKycCount  = 0;
  pendingLoanCount = 0;

  // ── Admin identity ────────────────────────────────────────
  get adminName():    string { return this.authService.getCurrentUser()?.fullName?.split(' ')[0] || 'Admin'; }
  get adminInitial(): string { return this.authService.getCurrentUser()?.fullName?.charAt(0).toUpperCase() || 'A'; }

  ngOnInit(): void {
    this.loadBadgeCounts();
    // Restore collapsed state
    const saved = localStorage.getItem('as_collapsed');
    if (saved !== null) this.collapsed = saved === 'true';
  }

  // ── Load pending badge counts ─────────────────────────────
  loadBadgeCounts(): void {
    forkJoin({
      users: this.adminService.getAllUsers().pipe(catchError(() => of([]))),
      loans: this.adminService.getAllLoanApplications().pipe(catchError(() => of([])))
    }).subscribe(({ users, loans }) => {
      this.pendingKycCount  = (users as any[]).filter(u => u.kycStatus === 'PENDING').length;
      this.pendingLoanCount = (loans as any[]).filter(l => l.status   === 'PENDING').length;
    });
  }

  // ── Toggle collapse ───────────────────────────────────────
  toggle(): void {
    this.collapsed = !this.collapsed;
    localStorage.setItem('as_collapsed', String(this.collapsed));
  }

  // ── Mobile ────────────────────────────────────────────────
  openMobile():  void { this.mobileOpen = true; }
  closeMobile(): void { this.mobileOpen = false; }

  // ── Logout ────────────────────────────────────────────────
  logout(): void {
    this.authService.logout();
  }

  // ── Close on ESC ─────────────────────────────────────────
  @HostListener('document:keydown.escape')
  onEsc(): void { this.mobileOpen = false; }
}