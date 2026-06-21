import { Component } from '@angular/core';

import { Sidebar } from '../../shared/components/sidebar/sidebar';

import { DashboardNavbar } from '../dashboard-navbar/dashboard-navbar';

import { WelcomeCard } from '../welcome-card/welcome-card';
import { TotalBalance } from '../total-balance/total-balance';
import { SavingsAccountCard } from '../savings-account-card/savings-account-card';
import { CurrentAccountCard } from '../current-account-card/current-account-card';
import { RecentTransactions } from '../recent-transactions/recent-transactions';
import { AnalyticsComponent } from '../analytics/analytics';
import { QuickActions } from '../QuickActions/quick-actions';

import { NotificationsPanel } from '../../notifications/notifications-panel/notifications-panel';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    Sidebar,
   // DashboardNavbar,
    WelcomeCard,
    TotalBalance,
    SavingsAccountCard,
    CurrentAccountCard,
    RecentTransactions,
    AnalyticsComponent,
    QuickActions,
    NotificationsPanel
  ],
  templateUrl:'./dashboard-home.html',
  styleUrls: ['./dashboard-home.css']
})
export class DashboardHome {

}