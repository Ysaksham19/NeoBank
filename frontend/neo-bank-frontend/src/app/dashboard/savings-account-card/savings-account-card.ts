import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountService } from '../../core/services/account';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-savings-account-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './savings-account-card.html',
  styleUrls: ['./savings-account-card.css']
})
export class SavingsAccountCard implements OnInit {

  savingsAccount?: Account;

  constructor(
    private accountService: AccountService
  ) {}

  ngOnInit(): void {

    this.accountService
      .getMyAccounts()
      .subscribe({

        next: (accounts) => {

          this.savingsAccount =
            accounts.find(
              account =>
                account.accountType === 'Savings Account'
            );

        },

        error: (error) => {

          console.error(
            'Failed to load savings account',
            error
          );

        }

      });

  }

}