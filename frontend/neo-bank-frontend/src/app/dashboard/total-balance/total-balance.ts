import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AccountService } from '../../core/services/account';

@Component({
  selector: 'app-total-balance',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './total-balance.html',
  styleUrls: ['./total-balance.css']
})
export class TotalBalance implements OnInit {

  totalBalance = 0;
  monthlyGrowth = 0;

  constructor(
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.loadBalance();
  }

  loadBalance(): void {

    this.accountService
      .getTotalBalance()
      .subscribe({

        next: (response: any) => {

          this.totalBalance = response.totalBalance;
          this.monthlyGrowth = response.monthlyGrowth;

        },

        error: (error) => {
          console.error('Failed to load balance', error);
        }

      });

  }

}