
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-beneficiary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl:'./add-beneficiary.html',
  styleUrls: ['./add-beneficiary.css']
})
export class AddBeneficiary {

  showModal = false;

  showToast = false;

  savedBeneficiaries: any[] = [];

  beneficiary = {
    fullName: '',
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    nickname: '',
    relationship: ''
  };

  openModal(): void {

    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

  }

  saveBeneficiary(): void {

    if (
      this.beneficiary.accountNumber !==
      this.beneficiary.confirmAccountNumber
    ) {

      return;

    }

    this.savedBeneficiaries.push({

      fullName: this.beneficiary.fullName,

      bankName: this.beneficiary.bankName,

      accountNumber:
        'XXXX' +
        this.beneficiary.accountNumber.slice(-4),

      ifscCode: this.beneficiary.ifscCode

    });

    this.showToast = true;

    setTimeout(() => {

      this.showToast = false;

    }, 3000);

    this.beneficiary = {

      fullName: '',
      bankName: '',
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
      nickname: '',
      relationship: ''

    };

    this.closeModal();

  }

}