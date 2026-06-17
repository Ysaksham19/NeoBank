import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { DashboardHome } from './dashboard/dashboard-home/dashboard-home';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  // PUBLIC ROUTES
  {
    path: '',
    component: Home
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  // USER DASHBOARD
  {
    path: 'dashboard',
    component: DashboardHome,
    canActivate: [AuthGuard]
  },

  // ADMIN DASHBOARD
  {
    path: 'admin-dashboard',
    component: AdminDashboard,
    canActivate: [AuthGuard]
  },

  // ALWAYS KEEP THIS LAST
  {
    path: '**',
    redirectTo: ''
  }

];