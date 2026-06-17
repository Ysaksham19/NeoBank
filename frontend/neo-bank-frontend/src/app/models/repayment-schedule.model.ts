export interface RepaymentSchedule {

  id: number;

  installmentNumber: number;

  dueDate: string;

  emiAmount: number;

  principalComponent: number;

  interestComponent: number;

  status: string;

}