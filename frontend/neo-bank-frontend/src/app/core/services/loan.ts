import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoanProduct } from '../../models/loan-product.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private readonly BASE_URL =
    'http://localhost:8080/api/loans';

  constructor(
    private http: HttpClient
  ) {}

  // Loan Products

  getLoanProducts(): Observable<LoanProduct[]> {

    return this.http.get<LoanProduct[]>(

      `${this.BASE_URL}/products`

    );

  }

  applyLoan(payload: any) {

    return this.http.post(

      `${this.BASE_URL}/apply`,

      payload

    );

  }

  getMyLoanAccounts() {

    return this.http.get<any[]>(

      `${this.BASE_URL}/my-accounts`

    );

  }

  getRepaymentSchedule(loanAccountId: number) {

    return this.http.get<any[]>(

      `${this.BASE_URL}/${loanAccountId}/repayments`

    );

  }

  markRepaymentAsPaid(
    loanAccountId: number,
    repaymentId: number
  ) {

    return this.http.patch(

      `${this.BASE_URL}/${loanAccountId}/repayments/${repaymentId}/pay`,

      {}

    );

  }

  getAllApplications() {

    return this.http.get<any[]>(

      `${this.BASE_URL}/admin/applications`

    );

  }

  decideLoan(
    applicationId: number,
    payload: any
  ) {

    return this.http.put(

      `${this.BASE_URL}/${applicationId}/decision`,

      payload

    );

  }

}