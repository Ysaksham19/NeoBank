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
  loading = true;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getTotalBalance().subscribe({
      next: (res: any) => {
        this.totalBalance = res.totalBalance;
        this.monthlyGrowth = res.monthlyGrowth;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
