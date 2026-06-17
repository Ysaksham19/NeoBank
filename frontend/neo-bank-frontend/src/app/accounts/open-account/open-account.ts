import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-open-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './open-account.html',
  styleUrls: ['./open-account.css']
})
export class OpenAccount {

  accountRequest = {

    accountType: 'Savings Account',

    fullName: '',

    email: '',

    phone: '',

    initialDeposit: ''

  };

  showToast = false;

  submitApplication(): void {

    console.log(this.accountRequest);

    this.showToast = true;

    setTimeout(() => {

      this.showToast = false;

    }, 3000);

    this.accountRequest = {

      accountType: 'Savings Account',

      fullName: '',

      email: '',

      phone: '',

      initialDeposit: ''

    };

  }

}