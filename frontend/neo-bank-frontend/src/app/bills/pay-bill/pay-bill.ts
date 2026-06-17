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

  showToast = false;

  constructor(
    private billService: BillService
  ) {}

  ngOnInit(): void {

    this.loadPendingBills();

  }

  loadPendingBills(): void {

    this.billService
      .getPendingBills()
      .subscribe({

        next: (response) => {

          this.pendingBills = response;

        }

      });

  }

  payBill(id: number): void {

    this.billService
      .payBill(id)
      .subscribe({

        next: () => {

          this.showToast = true;

          setTimeout(() => {

            this.showToast = false;

          }, 3000);

          this.loadPendingBills();

        }

      });

  }

}