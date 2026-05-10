import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TransactionService } from '../../core/services/transaction.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  loading = signal(true);
  user = signal<any>(null);
  transactions = signal<any[]>([]);
  error = signal('');

  totalCredit = signal(0);
  totalDebit = signal(0);

  totalSpent = signal(0);
  trendPercent = signal(0);
  lastUpdated = signal('');

  categoryStats = signal({
    shopping: 0,
    food: 0,
    bills: 0
  });

  isSidebarOpen = signal(false);
  greeting = signal(this.calculateGreeting());

  constructor(
    private authService: AuthService,
    private txnService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  calculateGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  loadDashboard() {
    this.loading.set(true);

    this.authService.me().subscribe({
      next: (userRes: any) => {
        this.user.set(userRes);
        this.loadTransactions();
      },
      error: () => {
        this.loading.set(false);
        this.logout();
      }
    });
  }

  loadTransactions() {
    this.txnService.getTransactions().subscribe({
      next: (txns: any[]) => {
        this.transactions.set(txns);
        this.calculateStats(txns);
        this.lastUpdated.set(new Date().toLocaleTimeString());
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load transactions');
      }
    });
  }

  calculateStats(txns: any[]) {
    let credit = 0;
    let debit = 0;
    let shopping = 0;
    let food = 0;
    let bills = 0;

    txns.forEach(t => {
      const cat = (t.category || '').toUpperCase();
      if (t.type === 'CREDIT') credit += t.amount;

      if (t.type === 'DEBIT') {
        debit += t.amount;
        if (cat === 'SHOPPING') shopping += t.amount;
        else if (cat === 'FOOD') food += t.amount;
        else bills += t.amount;
      }
    });

    this.totalCredit.set(credit);
    this.totalDebit.set(debit);
    this.totalSpent.set(debit);

    const trend = debit > 0 ? ((credit - debit) / debit) * 100 : 0;
    this.trendPercent.set(Math.round(trend));

    const total = shopping + food + bills || 1;

    this.categoryStats.set({
      shopping: Math.round((shopping / total) * 100),
      food: Math.round((food / total) * 100),
      bills: Math.round((bills / total) * 100)
    });
  }

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  goToTransfer() {
    this.router.navigate(['/transfer']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToSecurity() {
    this.router.navigate(['/security']);
  }
  
  goToSettings() {
    this.router.navigate(['/settings']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}