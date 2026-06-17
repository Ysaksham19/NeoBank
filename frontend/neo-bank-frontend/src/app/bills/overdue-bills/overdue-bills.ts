import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  constructor(
    private billService: BillService
  ) {}

  ngOnInit(): void {

    this.loadOverdueBills();

  }

  loadOverdueBills(): void {

    this.billService
      .getBills()
      .subscribe({

        next: (response) => {

          const today = new Date();

          this.overdueBills = response.filter(

            bill =>

              bill.status !== 'PAID' &&

              new Date(bill.dueDate) < today

          );

        }

      });

  }

}