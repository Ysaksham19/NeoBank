export interface AdminDashboard {
  totalUsers: number;
  totalActiveUsers: number;
  totalLoans: number;
  pendingApprovals: number;
  totalTransactions: number;
  platformSavingsRate: number;
}

export interface PendingApproval {
  id: number;
  type: string;
  applicantName: string;
  productName: string;
  requestedAmount: number;
  appliedAt: string;
}

export interface SystemHealth {
  dbStatus: 'UP' | 'DOWN';
  activeSessions: number;
  serverUptimeSeconds: number;
}

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}