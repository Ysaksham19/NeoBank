import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mini-statement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-statement.html',
  styleUrls: ['./mini-statement.css']
})
export class MiniStatement {

  transactions = [

    {
      date: '13 Jun 2026',
      description: 'Salary Credit',
      amount: 45000,
      type: 'CREDIT'
    },

    {
      date: '12 Jun 2026',
      description: 'Netflix Subscription',
      amount: 649,
      type: 'DEBIT'
    },

    {
      date: '11 Jun 2026',
      description: 'Amazon Purchase',
      amount: 1250,
      type: 'DEBIT'
    },

    {
      date: '10 Jun 2026',
      description: 'Transfer Received',
      amount: 2500,
      type: 'CREDIT'
    },

    {
      date: '09 Jun 2026',
      description: 'Electricity Bill',
      amount: 1800,
      type: 'DEBIT'
    }

  ];

}