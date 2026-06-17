import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Account } from '../../models/account.model';
import { AccountService } from '../../core/services/account';
import { TransactionService } from '../../core/services/transaction';

@Component({
  selector: 'app-withdraw-money',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './withdraw-money.html',
  styleUrls: ['./withdraw-money.css']
})
export class WithdrawMoney implements OnInit {

  accounts: Account[] = [];

  selectedAccountId!: number;

  showToast = false;

  errorMessage = '';

  withdrawRequest = {

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

  withdrawMoney(): void {

    this.errorMessage = '';

    this.transactionService
      .withdrawMoney(

        this.selectedAccountId,

        this.withdrawRequest.amount!,

        this.withdrawRequest.remarks

      )
      .subscribe({

        next: () => {

          this.showToast = true;

          setTimeout(() => {

            this.showToast = false;

          }, 3000);

          this.withdrawRequest = {

            amount: null,

            remarks: ''

          };

        },

        error: (error) => {

          this.errorMessage =
            error?.error?.message ||
            'Withdrawal failed';

        }

      });

  }

}