import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountService } from '../../core/services/account';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-details.html',
  styleUrls: ['./account-details.css']
})
export class AccountDetails implements OnInit {

  account?: Account;

  constructor(
    private accountService: AccountService
  ) {}

  ngOnInit(): void {

    this.loadAccount();

  }

  loadAccount(): void {

    this.accountService.getMyAccounts().subscribe({

      next: (accounts) => {

        if (accounts.length > 0) {

          this.account = accounts[0];

        }

      }

    });

  }

  maskAccount(accountNumber: string): string {

    return '**** **** ' + accountNumber.slice(-4);

  }

}