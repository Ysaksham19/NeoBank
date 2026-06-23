export interface RepaymentSchedule {
  repaymentId:        number;
  instalmentNumber:   number;
  dueDate:            string;
  emiAmount:          number;
  principalComponent: number;
  interestComponent:  number;
  closingBalance:     number;
  lateFee:            number;
  paymentStatus:      string;
  paidAt:             string | null;
}