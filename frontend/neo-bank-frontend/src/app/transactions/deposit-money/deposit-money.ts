import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Account } from '../../models/account.model';
import { AccountService } from '../../core/services/account';
import { TransactionService } from '../../core/services/transaction';

@Component({
  selector: 'app-deposit-money',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './deposit-money.html',
  styleUrls: ['./deposit-money.css']
})
export class DepositMoney implements OnInit {

  accounts: Account[] = [];

  selectedAccountId!: number;

  showToast = false;

  errorMessage = '';

  depositRequest = {

    amount: null as number | null,

    remarks: ''

  };

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {

    this.loadAccounts();

  }

  loadAccounts(): void {

    this.accountService.getMyAccounts().subscribe({

      next: (response) => {

        this.accounts = response;

        if (response.length > 0) {

          this.selectedAccountId = response[0].id;

        }

      }

    });

  }

  depositMoney(): void {

    this.errorMessage = '';

    this.transactionService
      .depositMoney(

        this.selectedAccountId,

        this.depositRequest.amount!,

        this.depositRequest.remarks

      )
      .subscribe({

        next: () => {

          this.showToast = true;

          setTimeout(() => {

            this.showToast = false;

          }, 3000);

          this.depositRequest = {

            amount: null,

            remarks: ''

          };

        },

        error: (error) => {

          this.errorMessage =
            error?.error?.message ||
            'Deposit failed';

        }

      });

  }

}