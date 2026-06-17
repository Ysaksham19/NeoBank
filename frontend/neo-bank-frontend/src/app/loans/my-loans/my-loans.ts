import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanService } from '../../core/services/loan';
import { LoanAccount } from '../../models/loan-account.model';

@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-loans.html',
  styleUrls: ['./my-loans.css']
})
export class MyLoans implements OnInit {

  loans: LoanAccount[] = [];

  constructor(
    private loanService: LoanService
  ) {}

  ngOnInit(): void {

    this.loadLoans();

  }

  loadLoans(): void {

    this.loanService
      .getMyLoanAccounts()
      .subscribe({

        next: (response) => {

          this.loans = response;

        },

        error: (error) => {

          console.error(
            'Failed to load loans',
            error
          );

        }

      });

  }

}