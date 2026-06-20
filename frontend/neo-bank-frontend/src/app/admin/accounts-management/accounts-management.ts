import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { AdminService } from '../../core/services/admin';
import { AdminAccount } from '../../models/admin-account.model';

@Component({
  selector: 'app-accounts-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts-management.html',
  styleUrls: ['./accounts-management.css']
})
export class AccountsManagement implements OnInit {

  accounts: AdminAccount[] = [];
  filtered: AdminAccount[] = [];
  loading        = true;
  errorMessage   = '';
  successMessage = '';

  searchQuery  = '';
  filterStatus = '';
  filterType   = '';

  // Stats always from full dataset
  get totalAccounts(): number { return this.accounts.length; }
  get activeCount():   number { return this.accounts.filter(a => a.status === 'ACTIVE').length; }
  get blockedCount():  number { return this.accounts.filter(a => a.status === 'BLOCKED').length; }
  get inactiveCount(): number { return this.accounts.filter(a => a.status === 'INACTIVE').length; }

  get uniqueStatuses(): string[] {
    return [...new Set(this.accounts.map(a => a.status).filter(Boolean))] as string[];
  }
  get uniqueTypes(): string[] {
    return [...new Set(this.accounts.map(a => a.accountType).filter(Boolean))] as string[];
  }
  get hasActiveFilters(): boolean {
    return !!(this.searchQuery || this.filterStatus || this.filterType);
  }

  constructor(
    private adminService: AdminService,
    private location: Location
  ) {}

  ngOnInit(): void { this.loadAccounts(); }

  loadAccounts(): void {
    this.loading       = true;
    this.errorMessage  = '';
    this.successMessage = '';

    this.adminService.getAllAccounts().subscribe({
      next: (res: AdminAccount[]) => {
        this.accounts = res;
        this.applyFilters();
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Unable to load accounts.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filtered = this.accounts.filter(a => {
      const matchesSearch = !q || [
        a.accountNo, a.customerNo, a.customerName, a.accountType, a.currency
      ].some(v => v?.toLowerCase().includes(q));
      const matchesStatus = !this.filterStatus || a.status      === this.filterStatus;
      const matchesType   = !this.filterType   || a.accountType === this.filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }

  clearFilters(): void {
    this.searchQuery  = '';
    this.filterStatus = '';
    this.filterType   = '';
    this.applyFilters();
  }

  updateStatus(accountId: number, status: string): void {
    this.errorMessage   = '';
    this.successMessage = '';

    this.adminService.updateAccountStatus(accountId, status).subscribe({
      next: () => {
        this.successMessage = `Account status updated to ${status} successfully.`;
        this.loadAccounts();
        setTimeout(() => this.successMessage = '', 4000);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Unable to update account status.';
      }
    });
  }

  goBack(): void { this.location.back(); }
}