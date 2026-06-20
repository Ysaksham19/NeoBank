import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { AdminService, AdminUser, AdminLoanApplication } from '../../core/services/admin';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {

  loading          = true;
  errorMessage     = '';
  loansUnavailable = false;   // ← shows a soft warning instead of hard crash

  totalUsers    = 0;
  activeUsers   = 0;
  blockedUsers  = 0;
  pendingKyc    = 0;
  pendingLoans  = 0;
  approvedLoans = 0;

  recentUsers: AdminUser[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void { this.loadDashboard(); }

  loadDashboard(): void {
    this.loading          = true;
    this.errorMessage     = '';
    this.loansUnavailable = false;

    forkJoin({
      users: this.adminService.getAllUsers().pipe(
        catchError((err: HttpErrorResponse) => {
          this.errorMessage = err.error?.message || 'Unable to load users.';
          return of([] as AdminUser[]);
        })
      ),
      applications: this.adminService.getAllLoanApplications().pipe(
        catchError(() => {
          this.loansUnavailable = true;   // soft warning — dashboard still loads
          return of([] as AdminLoanApplication[]);
        })
      )
    }).subscribe({
      next: ({ users, applications }) => {
        this.totalUsers    = users.length;
        this.activeUsers   = users.filter(u => u.status    === 'ACTIVE').length;
        this.blockedUsers  = users.filter(u => u.status    === 'BLOCKED').length;
        this.pendingKyc    = users.filter(u => u.kycStatus === 'PENDING').length;
        this.pendingLoans  = applications.filter(a => a.status === 'PENDING').length;
        this.approvedLoans = applications.filter(a => a.status === 'APPROVED').length;

        this.recentUsers = [...users]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 6);

        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Unable to load dashboard.';
        this.loading = false;
      }
    });
  }
}