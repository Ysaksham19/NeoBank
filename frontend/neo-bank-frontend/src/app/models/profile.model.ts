export interface ProfileAccount {
  id: number;
  accountNumber: string;
  accountType: string;   // SAVINGS | CURRENT
  balance: number;
  status: string;        // ACTIVE | INACTIVE
  branchName?: string;
  ifscCode?: string;
}

export interface ProfileResponse {
  userId: number;
  customerId: string;    // maps to backend "customerId"
  fullName: string;
  email: string;
  phone: string;
  status: string;        // ACTIVE | INACTIVE | LOCKED
  kycStatus: string;     // PENDING | ACCEPTED | REJECTED
  roles: string[];       // ['ROLE_ADMIN'] or ['ROLE_CUSTOMER']
  accounts: ProfileAccount[];
  createdAt: string;
}