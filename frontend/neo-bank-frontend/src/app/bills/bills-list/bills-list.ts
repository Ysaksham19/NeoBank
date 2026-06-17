import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Bill } from '../../models/bill.model';
import { BillService } from '../../core/services/bill';

@Component({
  selector: 'app-bills-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './bills-list.html',
  styleUrls: ['./bills-list.css']
})
export class BillsList implements OnInit {

  bills: Bill[] = [];

  constructor(
    private billService: BillService
  ) {}

  ngOnInit(): void {

    this.loadBills();

  }

  loadBills(): void {

    this.billService
      .getBills()
      .subscribe({

        next: (response) => {

          this.bills = response;

        },

        error: (error) => {

          console.error(
            'Failed to load bills',
            error
          );

        }

      });

  }

  payBill(id: number): void {

    this.billService
      .payBill(id)
      .subscribe({

        next: () => {

          this.loadBills();

        }

      });

  }

  deleteBill(id: number): void {

    this.billService
      .deleteBill(id)
      .subscribe({

        next: () => {

          this.loadBills();

        }

      });

  }

}