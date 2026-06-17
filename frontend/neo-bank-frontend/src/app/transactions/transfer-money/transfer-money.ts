import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Account } from '../../models/account.model';
import { AccountService } from '../../core/services/account';
import { TransactionService } from '../../core/services/transaction';

@Component({
  selector: 'app-transfer-money',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './transfer-money.html',
  styleUrls: ['./transfer-money.css']
})
export class TransferMoney implements OnInit {

  accounts: Account[] = [];

  selectedAccountId!: number;

  showToast = false;

  errorMessage = '';

  transferRequest = {

    receiverAccountNo: '',

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

  transferMoney(): void {

    this.errorMessage = '';

    this.transactionService
      .transferMoney(

        this.selectedAccountId,

        this.transferRequest

      )
      .subscribe({

        next: () => {

          this.showToast = true;

          setTimeout(() => {

            this.showToast = false;

          }, 3000);

          this.transferRequest = {

            receiverAccountNo: '',

            amount: null,

            remarks: ''

          };

        },

        error: (error) => {

          this.errorMessage =
            error?.error?.message ||
            'Transfer failed';

        }

      });

  }

}