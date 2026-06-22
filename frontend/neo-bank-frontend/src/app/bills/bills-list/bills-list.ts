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
  payingId: number | null = null;
  deletingId: number | null = null;
  successMsg = '';
  errorMsg = '';
  activeTab: 'all' | 'upcoming' | 'paid' | 'overdue' = 'all';

  // FIX 1: removed accountId — not part of BillRequestDTO
  newBill = {
    billerName: '',
    category: 'ELECTRICITY',
    amount: null as number | null,
    dueDate: ''
  };

  // FIX 2: category values exactly match BillCategory enum in backend
  readonly categories = [
    { value: 'ELECTRICITY', label: 'Electricity',  icon: '⚡' },
    { value: 'WATER',       label: 'Water',        icon: '💧' },
    { value: 'GAS',         label: 'Gas',          icon: '🔥' },
    { value: 'INTERNET',    label: 'Internet',     icon: '🌐' },
    { value: 'MOBILE',      label: 'Mobile/Phone', icon: '📱' },  // was 'PHONE'
    { value: 'CREDIT_CARD', label: 'Credit Card',  icon: '💳' },
    { value: 'RENT',        label: 'Rent',         icon: '🏠' },
    { value: 'OTHER',       label: 'Other',        icon: '📋' }
    // removed: INSURANCE, LOAN_EMI, OTT — not in BillCategory enum
  ];

  constructor(
    private billService: BillService,
    private location: Location
  ) {}

  ngOnInit(): void { this.loadBills(); }

  get filteredBills(): Bill[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    switch (this.activeTab) {
      case 'upcoming':
        return this.bills.filter(b => b.status === 'PENDING' && new Date(b.dueDate) >= today);
      case 'paid':
        return this.bills.filter(b => b.status === 'PAID');
      case 'overdue':
        return this.bills.filter(b => this.isOverdue(b));
      default:
        return this.bills;
    }
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

    // FIX 3: client-side date guard mirrors backend @FutureOrPresent
    const selectedDate = new Date(this.newBill.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      this.errorMsg = 'Due date cannot be in the past.'; return;
    }

    this.errorMsg = '';
    this.submitting = true;

    // FIX 4: only send fields in BillRequestDTO — no accountId
    this.billService.createBill({
      billerName: this.newBill.billerName.trim(),
      category:   this.newBill.category,
      amount:     Number(this.newBill.amount),
      dueDate:    this.newBill.dueDate
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.showForm = false;
        this.successMsg = 'Bill added successfully!';
        this.newBill = { billerName: '', category: 'ELECTRICITY', amount: null, dueDate: '' };
        this.loadBills();
        setTimeout(() => (this.successMsg = ''), 4000);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMsg = err?.error?.message || 'Failed to create bill.';
        setTimeout(() => (this.errorMsg = ''), 5000);
      }
    });
  }

  payBill(id: number): void {
    // FIX 5: prevent double-click / duplicate pay calls
    if (this.payingId === id) return;
    this.payingId = id;
    this.errorMsg = '';

    this.billService.payBill(id).subscribe({
      next: () => {
        this.payingId = null;
        this.successMsg = '✅ Payment successful! 2% cashback credited.';
        this.loadBills();
        setTimeout(() => (this.successMsg = ''), 5000);
      },
      error: (err) => {
        this.payingId = null;
        const msg: string = err?.error?.message || '';
        if (msg.toLowerCase().includes('already paid')) {
          this.errorMsg = 'This bill has already been paid.';
          this.loadBills(); // refresh to show correct PAID status
        } else {
          this.errorMsg = msg || 'Payment failed. Please try again.';
        }
        setTimeout(() => (this.errorMsg = ''), 5000);
      }
    });
  }

  deleteBill(id: number): void {
    // FIX 6: block delete on PAID bills — keep for records
    const bill = this.bills.find(b => b.id === id);
    if (bill && bill.status === 'PAID') {
      this.errorMsg = 'Paid bills cannot be deleted. They are kept for your records.';
      setTimeout(() => (this.errorMsg = ''), 5000);
      return;
    }
    if (!confirm('Are you sure you want to remove this bill?')) return;
    this.deletingId = id;
    this.billService.deleteBill(id).subscribe({
      next: () => {
        this.deletingId = null;
        this.successMsg = 'Bill removed.';
        this.loadBills();
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: () => {
        this.deletingId = null;
        this.errorMsg = 'Delete failed. Please try again.';
        setTimeout(() => (this.errorMsg = ''), 4000);
      }
    });
  }

  getTotalPending(): number {
    return this.bills.filter(b => b.status === 'PENDING').reduce((s, b) => s + b.amount, 0);
  }

  getTotalPaid(): number {
    return this.bills.filter(b => b.status === 'PAID').reduce((s, b) => s + b.amount, 0);
  }

  getOverdueCount(): number {
    return this.bills.filter(b => this.isOverdue(b)).length;
  }

  getPendingCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.bills.filter(b => b.status === 'PENDING' && new Date(b.dueDate) >= today).length;
  }

  getDueSoonCount(): number {
    const today = new Date();
    const soon = new Date();
    soon.setDate(soon.getDate() + 7);
    return this.bills.filter(b =>
      b.status === 'PENDING' &&
      new Date(b.dueDate) >= today &&
      new Date(b.dueDate) <= soon
    ).length;
  }

  getCategoryIcon(cat: string): string {
    const found = this.categories.find(c => c.value === cat);
    return found ? found.icon : '📋';
  }

  getCategoryLabel(cat: string): string {
    const found = this.categories.find(c => c.value === cat);
    return found ? found.label : cat;
  }

  isOverdue(bill: Bill): boolean {
    if (bill.status === 'PAID') return false;
    const due = new Date(bill.dueDate);
    due.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  }

  isDueSoon(bill: Bill): boolean {
    if (bill.status === 'PAID' || this.isOverdue(bill)) return false;
    const due = new Date(bill.dueDate);
    const today = new Date();
    const diff = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }

  getBillStatus(bill: Bill): string {
    if (bill.status === 'PAID') return 'PAID';
    if (this.isOverdue(bill)) return 'OVERDUE';
    if (this.isDueSoon(bill)) return 'DUE SOON';
    return 'PENDING';
  }

  getDaysUntilDue(bill: Bill): number {
    const due = new Date(bill.dueDate);
    const today = new Date();
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  cancelForm(): void {
    this.showForm = false;
    this.errorMsg = '';
    this.newBill = { billerName: '', category: 'ELECTRICITY', amount: null, dueDate: '' };
  }
}