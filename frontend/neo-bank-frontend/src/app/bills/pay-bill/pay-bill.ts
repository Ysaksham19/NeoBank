import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Bill } from '../../models/bill.model';
import { BillService } from '../../core/services/bill';

@Component({
  selector: 'app-pay-bill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pay-bill.html',
  styleUrls: ['./pay-bill.css']
})
export class PayBill implements OnInit {

  pendingBills: Bill[] = [];
  isLoading = false;
  showToast = false;
  errorMessage = '';

  constructor(private billService: BillService) {}

  ngOnInit(): void {
    this.loadPendingBills();
  }

  loadPendingBills(): void {
    this.isLoading = true;
    this.billService.getPendingBills().subscribe({
      next: (response) => {
        this.pendingBills = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load pending bills', error);
        this.isLoading = false;
      }
    });
  }

  payBill(id: number): void {
    this.billService.payBill(id).subscribe({
      next: () => {
        this.showToast = true;
        this.errorMessage = '';
        setTimeout(() => { this.showToast = false; }, 3000);
        this.loadPendingBills();
      },
      error: (error) => {
        console.error('Payment failed', error);
        this.errorMessage = 'Payment failed. Please try again.';
      }
    });
  }
}