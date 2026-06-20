import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService, AdminTransaction } from '../../core/services/admin';

@Component({
  selector: 'app-transactions-management',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './transactions-management.html',
  styleUrls: ['./transactions-management.css']
})
export class TransactionsManagement implements OnInit {
  transactions: AdminTransaction[] = [];
  loading = true;
  errorMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.errorMessage = '';

    this.adminService.getAllTransactions().subscribe({
      next: (res: AdminTransaction[]) => {
        this.transactions = res;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Unable to load transactions.';
        this.loading = false;
      }
    });
  }
}