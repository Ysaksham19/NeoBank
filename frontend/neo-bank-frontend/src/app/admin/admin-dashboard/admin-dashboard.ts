import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AdminService } from '../../core/services/admin';
import { LoanService } from '../../core/services/loan';
import { AdminUser } from '../../models/admin-user.model';
import { LoanApplication } from '../../models/loan-application.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  loading = true;
  errorMessage = '';

  totalUsers = 0;
  activeUsers = 0;
  blockedUsers = 0;
  pendingLoans = 0;
  approvedLoans = 0;

  users: AdminUser[] = [];
  applications: LoanApplication[] = [];
  recentUsers: AdminUser[] = [];

  constructor(
    private adminService: AdminService,
    private loanService: LoanService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      users: this.adminService.getAllUsers(),
      applications: this.loanService.getAllApplications()
    }).subscribe({
      next: ({ users, applications }) => {
        this.users = users;
        this.applications = applications;

        this.totalUsers = users.length;
        this.activeUsers = users.filter(user => user.status === 'ACTIVE').length;
        this.blockedUsers = users.filter(user => user.status === 'BLOCKED').length;

        this.pendingLoans = applications.filter(app => app.status === 'PENDING').length;
        this.approvedLoans = applications.filter(app => app.status === 'APPROVED').length;

        this.recentUsers = [...users].slice(0, 6);

        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to load admin dashboard.';
        this.loading = false;
      }
    });
  }
}