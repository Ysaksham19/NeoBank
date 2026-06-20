import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from '../../core/services/admin';
import { AdminTransaction } from '../../models/admin-transaction.model';

@Component({
  selector: 'app-transactions-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions-management.html',
  styleUrls: ['./transactions-management.css']
})
export class TransactionsManagement implements OnInit {

  transactions: AdminTransaction[] = [];
  filtered: AdminTransaction[] = [];
  loading = true;
  errorMessage = '';

  searchQuery  = '';
  filterType   = '';
  filterStatus = '';

  // Always from full dataset — unaffected by filters
  get successCount(): number {
    return this.transactions.filter(t => t.transactionStatus === 'SUCCESS').length;
  }

  get failedCount(): number {
    return this.transactions.filter(t => t.transactionStatus === 'FAILED').length;
  }

  get pendingCount(): number {
    return this.transactions.filter(t => t.transactionStatus === 'PENDING').length;
  }

  // Volume reflects current filtered view
  get totalAmount(): number {
    return this.filtered.reduce((sum, t) => sum + (t.amount || 0), 0);
  }

  get uniqueTypes(): string[] {
    return [...new Set(
      this.transactions.map(t => t.transactionType).filter(Boolean)
    )] as string[];
  }

  get uniqueStatuses(): string[] {
    return [...new Set(
      this.transactions.map(t => t.transactionStatus).filter(Boolean)
    )] as string[];
  }

  get hasActiveFilters(): boolean {
    return !!(this.searchQuery || this.filterType || this.filterStatus);
  }

  constructor(
    private adminService: AdminService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.errorMessage = '';

    this.adminService.getAllTransactions().subscribe({
      next: (res: AdminTransaction[]) => {
        this.transactions = res;
        this.applyFilters();
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Unable to load transactions.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    const q = this.searchQuery.toLowerCase().trim();

    this.filtered = this.transactions.filter(t => {
      const matchesSearch = !q || [
        t.transactionRef,
        t.customerNo,
        t.customerName,
        t.senderAccountNo,
        t.receiverAccountNo,
        t.remarks
      ].some(v => v?.toLowerCase().includes(q));

      const matchesType   = !this.filterType   || t.transactionType   === this.filterType;
      const matchesStatus = !this.filterStatus || t.transactionStatus === this.filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchQuery  = '';
    this.filterType   = '';
    this.filterStatus = '';
    this.applyFilters();
  }

  goBack(): void {
    this.location.back();
  }
}