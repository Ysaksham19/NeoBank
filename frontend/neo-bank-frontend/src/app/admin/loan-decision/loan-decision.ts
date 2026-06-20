import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { AdminService, AdminLoanApplication } from '../../core/services/admin';

@Component({
  selector: 'app-loan-decision',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-decision.html',
  styleUrls: ['./loan-decision.css']
})
export class LoanDecision implements OnInit {

  applications: AdminLoanApplication[] = [];
  filtered: AdminLoanApplication[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  filterStatus = '';
  remarks: { [key: number]: string } = {};

  get pendingCount():  number { return this.applications.filter(a => a.status === 'PENDING').length; }
  get approvedCount(): number { return this.applications.filter(a => a.status === 'APPROVED').length; }
  get rejectedCount(): number { return this.applications.filter(a => a.status === 'REJECTED').length; }

  constructor(
    private adminService: AdminService,
    private location: Location
  ) {}

  ngOnInit(): void { this.loadApplications(); }

  loadApplications(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.adminService.getAllLoanApplications().subscribe({
      next: (res: AdminLoanApplication[]) => {
        this.applications = res;
        this.applyFilter();
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Unable to load loan applications.';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    this.filtered = this.filterStatus
      ? this.applications.filter(a => a.status === this.filterStatus)
      : [...this.applications];
  }

  approve(id: number): void {
    this.errorMessage = '';
    this.adminService.decideLoan(id, {
      decision: 'APPROVED',
      adminRemarks: this.remarks[id] || ''
    }).subscribe({
      next: () => {
        this.successMessage = `Application #${id} approved successfully.`;
        this.loadApplications();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Unable to approve application.';
      }
    });
  }

  reject(id: number): void {
    this.errorMessage = '';
    this.adminService.decideLoan(id, {
      decision: 'REJECTED',
      adminRemarks: this.remarks[id] || ''
    }).subscribe({
      next: () => {
        this.successMessage = `Application #${id} rejected.`;
        this.loadApplications();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Unable to reject application.';
      }
    });
  }

  goBack(): void { this.location.back(); }
}