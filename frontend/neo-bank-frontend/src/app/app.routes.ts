import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

import { Home } from './home/home';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { DashboardHome } from './dashboard/dashboard-home/dashboard-home';
import { AccountList } from './accounts/account-list/account-list';
import { AccountDetails } from './accounts/account-details/account-details';
import { MiniStatement } from './accounts/mini-statement/mini-statement';
import { OpenAccount } from './accounts/open-account/open-account';
import { TransactionHistory } from './transactions/transaction-history/transaction-history';
import { TransferMoney } from './transactions/transfer-money/transfer-money';
import { DepositMoney } from './transactions/deposit-money/deposit-money';
import { WithdrawMoney } from './transactions/withdraw-money/withdraw-money';
import { LoanProducts } from './loans/loan-products/loan-products';
import { ApplyLoan } from './loans/apply-loan/apply-loan';
import { MyLoans } from './loans/my-loans/my-loans';
import { RepaymentScheduleComponent } from './loans/repayment-schedule/repayment-schedule';
import { BillsList } from './bills/bills-list/bills-list';
import { PayBill } from './bills/pay-bill/pay-bill';
import { BudgetDashboard } from './budgets/budget-dashboard/budget-dashboard';
import { CreateBudget } from './budgets/create-budget/create-budget';
import { RewardsDashboard } from './rewards/rewards-dashboard/rewards-dashboard';
import { NotificationsPanel } from './notifications/notifications-panel/notifications-panel';
import { Profile } from './dashboard/profile/profile';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { UsersManagement } from './admin/users-management/users-management';
import { LoanDecision } from './admin/loan-decision/loan-decision';
import { TransactionsManagement } from './admin/transactions-management/transactions-management';

export const routes: Routes = [
  // ── Public ──
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },

  // ── Dashboard ──
  { path: 'dashboard', component: DashboardHome, canActivate: [AuthGuard] },

  // ── Accounts ──
  { path: 'accounts', component: AccountList, canActivate: [AuthGuard] },
  { path: 'accounts/open', component: OpenAccount, canActivate: [AuthGuard] },
  { path: 'accounts/:id', component: AccountDetails, canActivate: [AuthGuard] },
  { path: 'accounts/:id/mini-statement', component: MiniStatement, canActivate: [AuthGuard] },

  // ── Transactions ──
  { path: 'transactions', component: TransactionHistory, canActivate: [AuthGuard] },
  { path: 'transactions/transfer', component: TransferMoney, canActivate: [AuthGuard] },
  { path: 'transactions/deposit', component: DepositMoney, canActivate: [AuthGuard] },
  { path: 'transactions/withdraw', component: WithdrawMoney, canActivate: [AuthGuard] },

  // ── Loans ──
  { path: 'loans', component: MyLoans, canActivate: [AuthGuard] },
  { path: 'loans/products', component: LoanProducts, canActivate: [AuthGuard] },
  { path: 'loans/apply', component: ApplyLoan, canActivate: [AuthGuard] },
  { path: 'loans/repayments', component: RepaymentScheduleComponent, canActivate: [AuthGuard] },

  // ── Bills ──
  { path: 'bills', component: BillsList, canActivate: [AuthGuard] },
  { path: 'bills/pay', component: PayBill, canActivate: [AuthGuard] },

  // ── Budgets ──
  { path: 'budgets', component: BudgetDashboard, canActivate: [AuthGuard] },
  { path: 'budgets/create', component: CreateBudget, canActivate: [AuthGuard] },

  // ── Rewards ──
  { path: 'rewards', component: RewardsDashboard, canActivate: [AuthGuard] },

  // ── Notifications ──
  { path: 'notifications', component: NotificationsPanel, canActivate: [AuthGuard] },

  // ── Profile ──
  { path: 'profile', component: Profile, canActivate: [AuthGuard] },

  // ── Admin ──
  { path: 'admin', component: AdminDashboard, canActivate: [AuthGuard, adminGuard] },
  { path: 'admin/users', component: UsersManagement, canActivate: [AuthGuard, adminGuard] },
  { path: 'admin/loans', component: LoanDecision, canActivate: [AuthGuard, adminGuard] },
  { path: 'admin/transactions', component: TransactionsManagement, canActivate: [AuthGuard, adminGuard] },

  // ── Fallback ──
  { path: '**', redirectTo: '' }
];
