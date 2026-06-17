import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Bill } from '../../models/bill.model';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private readonly BASE_URL =
    'http://localhost:8080/api/v1/bills';

  constructor(
    private http: HttpClient
  ) {}

  // CREATE BILL

  createBill(payload: any): Observable<any> {

    return this.http.post(

      this.BASE_URL,

      payload

    );

  }

  // GET ALL BILLS

  getBills(): Observable<Bill[]> {

    return this.http.get<Bill[]>(

      this.BASE_URL

    );

  }

  // GET PENDING BILLS

  getPendingBills(): Observable<Bill[]> {

    return this.http.get<Bill[]>(

      `${this.BASE_URL}/pending`

    );

  }

  // PAY BILL

  payBill(id: number): Observable<any> {

    return this.http.put(

      `${this.BASE_URL}/pay/${id}`,

      {}

    );

  }

  // DELETE BILL

  deleteBill(id: number): Observable<any> {

    return this.http.delete(

      `${this.BASE_URL}/${id}`

    );

  }

}