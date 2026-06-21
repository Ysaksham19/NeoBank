import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

import { Bill } from '../../models/bill.model';
import { BillService } from '../../core/services/bill';

@Component({
  selector: 'app-overdue-bills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overdue-bills.html',
  styleUrls: ['./overdue-bills.css']
})
export class OverdueBills implements OnInit {

  overdueBills: Bill[] = [];
  isLoading = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    private billService: BillService,
    private location: Location
  ) {}

  ngOnInit(): void { this.loadOverdueBills(); }

  goBack(): void { this.location.back(); }

  loadOverdueBills(): void {
    this.isLoading = true;
    // ✅ Uses server-side /overdue endpoint — no client-side filtering needed
    this.billService.getOverdueBills().subscribe({
      next: (res) => { this.overdueBills = res; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  payBill(id: number): void {
    this.billService.payBill(id).subscribe({
      next: () => {
        this.successMsg = 'Bill paid successfully!';
        this.loadOverdueBills();
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Payment failed. Please try again.';
      }
    });
  }

  getDaysOverdue(dueDate: string): number {
    const diff = new Date().getTime() - new Date(dueDate).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  getCategoryIcon(cat: string): string {
    const icons: Record<string, string> = {
      ELECTRICITY: '⚡', WATER: '💧', GAS: '🔥', INTERNET: '🌐',
      PHONE: '📱', RENT: '🏠', INSURANCE: '🛡', OTHER: '📋'
    };
    return icons[cat] ?? '📋';
  }
}