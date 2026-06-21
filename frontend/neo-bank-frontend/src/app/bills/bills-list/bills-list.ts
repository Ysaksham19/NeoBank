import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Bill } from '../../models/bill.model';
import { BillService } from '../../core/services/bill';

@Component({
  selector: 'app-bills-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bills-list.html',
  styleUrls: ['./bills-list.css']
})
export class BillsList implements OnInit {

  bills: Bill[] = [];
  isLoading = false;

  constructor(private billService: BillService) {}

  ngOnInit(): void {
    this.loadBills();
  }

  loadBills(): void {
    this.isLoading = true;
    this.billService.getBills().subscribe({
      next: (response) => {
        this.bills = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load bills', error);
        this.isLoading = false;
      }
    });
  }

  payBill(id: number): void {
    this.billService.payBill(id).subscribe({
      next: () => { this.loadBills(); },
      error: (error) => { console.error('Pay bill failed', error); }
    });
  }

  deleteBill(id: number): void {
    this.billService.deleteBill(id).subscribe({
      next: () => { this.loadBills(); },
      error: (error) => { console.error('Delete bill failed', error); }
    });
  }
}