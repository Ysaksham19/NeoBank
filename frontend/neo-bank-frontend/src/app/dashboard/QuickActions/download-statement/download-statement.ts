import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-download-statement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './download-statement.html',
  styleUrls: ['./download-statement.css']
})
export class DownloadStatement {

  showModal = false;

  statement = {
    account: 'Savings Account',
    format: 'PDF',
    fromDate: '',
    toDate: ''
  };

  openModal(): void {

    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

  }

  downloadStatement(): void {

    console.log(this.statement);

    alert('Statement download started');

    this.closeModal();

  }

}