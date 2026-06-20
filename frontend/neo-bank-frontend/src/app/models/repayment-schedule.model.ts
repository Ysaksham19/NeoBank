export interface RepaymentSchedule {
  instalmentNumber: number;
  dueDate: string;
  emiAmount: number;
  principalComponent: number;
  interestComponent: number;
  paymentStatus: string;
}
