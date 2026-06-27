import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminDashboardService } from '../../core/services/admin-dashboard';
import { PendingApproval } from '../../models/admin.model';

@Component({
  selector: 'app-pending-approvals',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './pending-approvals.html',
  styleUrls: ['./pending-approvals.css']
})
export class PendingApprovals implements OnInit {

  approvals: PendingApproval[] = [];
  loading = true;
  displayedColumns = ['id', 'type', 'applicantName', 'productName', 'requestedAmount', 'appliedAt', 'action'];

  constructor(
    private adminService: AdminDashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adminService.getPendingApprovals().subscribe({
      next: (data) => { this.approvals = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  review(id: number): void {
    this.router.navigate(['/admin/loan-decision'], { queryParams: { id } });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }
}