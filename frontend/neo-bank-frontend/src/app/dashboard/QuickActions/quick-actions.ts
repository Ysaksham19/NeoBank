import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransferMoney } from '../QuickActions/transfer-money/transfer-money';
import { PayBills } from '../QuickActions/pay-bills/pay-bills';
import { AddBeneficiary } from '../QuickActions/add-beneficiary/add-beneficiary';
import { DownloadStatement } from '../QuickActions/download-statement/download-statement';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [
    CommonModule,
    TransferMoney,
    PayBills,
    AddBeneficiary,
    DownloadStatement
  ],
  templateUrl: './quick-actions.html',
  styleUrls: ['./quick-actions.css']
})
export class QuickActions {

}