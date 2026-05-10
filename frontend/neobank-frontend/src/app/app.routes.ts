// src/app/app.routes.ts

import { Routes } from '@angular/router';

/* PUBLIC */
import { HomeComponent } from './features/home/home';

/* AUTH */
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';

/* DASHBOARD */
import { DashboardComponent } from './features/dashboard/dashboard';

// /* ACCOUNTS */
// import { AccountDetailComponent } from './features/accounts/account-detail/account-detail';

// /* TRANSFER */
// import { FundTransferComponent } from './features/transfer/fund-transfer/fund-transfer';

// /* TRANSACTIONS */
// import { TransactionHistoryComponent } from './features/transactions/transaction-history/transaction-history';

// /* ADMIN */
// import { AdminDashboardComponent } from './features/admin/dashboard/dashboard';

// /* GUARDS */
 import { authGuard } from './core/guards/auth-guard';
 import { guestGuard } from './core/guards/guest-guard';
// import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  /* DEFAULT */
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  /* PUBLIC */
  {
    path: 'home',
    component: HomeComponent
  },

  /* =========================
     AUTH ROUTES
  ========================= */
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  },

  /* =========================
     USER PROTECTED ROUTES
  ========================= */

  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DashboardComponent
  },

  // {
  //   path: 'accounts',
  //   canActivate: [authGuard],
  //   component: AccountDetailComponent
  // },

  // {
  //   path: 'transfer',
  //   canActivate: [authGuard],
  //   component: FundTransferComponent
  // },

  // {
  //   path: 'transactions',
  //   canActivate: [authGuard],
  //   component: TransactionHistoryComponent
  // },

  // /* =========================
  //    ADMIN ROUTES
  // ========================= */

  // {
  //   path: 'admin',
  //   canActivate: [authGuard, roleGuard],
  //   data: { role: 'ADMIN' },
  //   component: AdminDashboardComponent
  // },

  /* =========================
     WILDCARD
  ========================= */

  {
    path: '**',
    redirectTo: 'home'
  }

];