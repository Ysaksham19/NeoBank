import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

import { Bill } from '../../models/bill.model';
import { BillService } from '../../core/services/bill';

@Component({
  selector: 'app-bills-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bills-list.html',
  styleUrls: ['./bills-list.css']
})
export class BillsList implements OnInit {

  bills: Bill[] = [];
  isLoading = false;
  showForm = false;
  submitting = false;
  successMsg = '';
  errorMsg = '';
  statusFilter = '';   // '' | 'PENDING' | 'PAID'

  newBill = {
    billerName: '',
    category: 'ELECTRICITY',
    amount: null as number | null,
    dueDate: '',
    accountId: null as number | null
  };

  readonly categories = [
    'ELECTRICITY', 'WATER', 'GAS', 'INTERNET',
    'PHONE', 'RENT', 'INSURANCE', 'OTHER'
  ];

  constructor(
    private billService: BillService,
    private location: Location
  ) {}

  ngOnInit(): void { this.loadBills(); }

  get filteredBills(): Bill[] {
    if (!this.statusFilter) return this.bills;
    return this.bills.filter(b => b.status === this.statusFilter);
  }

  goBack(): void { this.location.back(); }

  loadBills(): void {
    this.isLoading = true;
    this.billService.getBills().subscribe({
      next: (res) => { this.bills = res; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  createBill(): void {
    if (!this.newBill.billerName.trim()) { this.errorMsg = 'Biller name is required.'; return; }
    if (!this.newBill.amount || this.newBill.amount <= 0) {
      this.errorMsg = 'Amount must be greater than 0.'; return;
    }
    if (!this.newBill.dueDate) { this.errorMsg = 'Due date is required.'; return; }
    if (!this.newBill.accountId) { this.errorMsg = 'Account ID is required.'; return; }

    this.errorMsg = '';
    this.submitting = true;

    this.billService.createBill({
      billerName: this.newBill.billerName.trim(),
      category:   this.newBill.category,
      amount:     Number(this.newBill.amount),
      dueDate:    this.newBill.dueDate,
      accountId:  Number(this.newBill.accountId)
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.showForm = false;
        this.successMsg = 'Bill created successfully!';
        this.newBill = { billerName: '', category: 'ELECTRICITY', amount: null, dueDate: '', accountId: null };
        this.loadBills();
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMsg = err?.error?.message || 'Failed to create bill.';
      }
    });
  }

  payBill(id: number): void {
    this.billService.payBill(id).subscribe({
      next: () => {
        this.successMsg = 'Bill paid successfully!';
        this.loadBills();
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Payment failed. Please try again.';
      }
    });
  }

  deleteBill(id: number): void {
    if (!confirm('Are you sure you want to delete this bill?')) return;
    this.billService.deleteBill(id).subscribe({
      next: () => {
        this.successMsg = 'Bill deleted.';
        this.loadBills();
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: () => { this.errorMsg = 'Delete failed. Please try again.'; }
    });
  }

  getTotalPending(): number {
    return this.bills
      .filter(b => b.status === 'PENDING')
      .reduce((s, b) => s + b.amount, 0);
  }

  getCategoryIcon(cat: string): string {
    const icons: Record<string, string> = {
      ELECTRICITY: '⚡', WATER: '💧', GAS: '🔥', INTERNET: '🌐',
      PHONE: '📱', RENT: '🏠', INSURANCE: '🛡', OTHER: '📋'
    };
    return icons[cat] ?? '📋';
  }

  isOverdue(bill: Bill): boolean {
    return bill.status !== 'PAID' && new Date(bill.dueDate) < new Date();
  }
}