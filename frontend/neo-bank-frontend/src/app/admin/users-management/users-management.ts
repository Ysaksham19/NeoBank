import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { AdminService } from '../../core/services/admin';
import { AdminUser } from '../../models/admin-user.model';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-management.html',
  styleUrls: ['./users-management.css']
})
export class UsersManagement implements OnInit {

  users: AdminUser[] = [];
  filtered: AdminUser[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  searchQuery  = '';
  filterStatus = '';
  filterKyc    = '';

  get totalUsers():   number { return this.filtered.length; }
  get activeUsers():  number { return this.filtered.filter(u => u.status === 'ACTIVE').length; }
  get blockedUsers(): number { return this.filtered.filter(u => u.status === 'BLOCKED').length; }
  get pendingKyc():   number { return this.filtered.filter(u => u.kycStatus === 'PENDING').length; }

  get hasActiveFilters(): boolean {
    return !!(this.searchQuery || this.filterStatus || this.filterKyc);
  }

  constructor(
    private adminService: AdminService,
    private location: Location
  ) {}

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.adminService.getAllUsers().subscribe({
      next: (res: AdminUser[]) => {
        this.users = res;
        this.applyFilters();
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Unable to load users.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filtered = this.users.filter(u => {
      const matchesSearch = !q || [u.fullName, u.email, u.customerNo, u.phone]
        .some(v => v?.toLowerCase().includes(q));
      const matchesStatus = !this.filterStatus || u.status === this.filterStatus;
      const matchesKyc    = !this.filterKyc    || u.kycStatus === this.filterKyc;
      return matchesSearch && matchesStatus && matchesKyc;
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterStatus = '';
    this.filterKyc = '';
    this.applyFilters();
  }

  updateStatus(userId: number, status: string): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.adminService.updateUserStatus(userId, status).subscribe({
      next: () => {
        this.successMessage = `User #${userId} status updated to ${status}.`;
        this.loadUsers();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Unable to update user status.';
      }
    });
  }

  updateKycStatus(userId: number, kycStatus: string): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.adminService.updateKycStatus(userId, kycStatus).subscribe({
      next: () => {
        this.successMessage = `User #${userId} KYC updated to ${kycStatus}.`;
        this.loadUsers();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Unable to update KYC status.';
      }
    });
  }

  goBack(): void { this.location.back(); }
}