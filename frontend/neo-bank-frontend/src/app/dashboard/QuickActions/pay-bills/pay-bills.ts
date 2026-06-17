
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pay-bills',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './pay-bills.html',
  styleUrls: ['./pay-bills.css']
})
export class PayBills {

  showModal = false;

  showToast = false;

  bill = {
    category: 'Electricity',
    provider: '',
    consumerNumber: '',
    amount: '',
    account: 'Savings Account'
  };

  openModal(): void {

    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

  }

  payBill(): void {

    this.showToast = true;

    setTimeout(() => {

      this.showToast = false;

    }, 3000);

    this.closeModal();

  }

}
