import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountService } from '../../core/services/account';

import { Account } from '../../models/account.model';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-list.html',
  styleUrls: ['./account-list.css']
})
export class AccountList implements OnInit {

  accounts: Account[] = [];

  loading = true;

  constructor(
    private accountService: AccountService
  ) {}

  ngOnInit(): void {

    this.loadAccounts();

  }

  loadAccounts(): void {

    this.accountService.getMyAccounts().subscribe({

      next:   (response) => {

        this.accounts = response;

        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });

  }

  maskAccount(accountNumber: string): string {

    return '**** ' + accountNumber.slice(-4);

  }

}