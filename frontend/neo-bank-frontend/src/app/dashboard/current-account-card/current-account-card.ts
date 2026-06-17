import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountService } from '../../core/services/account';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-current-account-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './current-account-card.html',
  styleUrls: ['./current-account-card.css']
})
export class CurrentAccountCard implements OnInit {

  currentAccount?: Account;

  constructor(
    private accountService: AccountService
  ) {}

  ngOnInit(): void {

    this.accountService
      .getMyAccounts()
      .subscribe({

        next: (accounts) => {

          this.currentAccount =
            accounts.find(
              account =>
                account.accountType === 'Current Account'
            );

        },

        error: (error) => {

          console.error(
            'Failed to load current account',
            error
          );

        }

      });

  }

}