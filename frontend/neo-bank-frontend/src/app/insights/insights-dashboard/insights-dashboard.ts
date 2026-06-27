import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { InsightsService } from '../../core/services/insights';
import { FinancialInsights } from '../../models/insights.model';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-insights-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    BaseChartDirective
  ],
  templateUrl: './insights-dashboard.html',
  styleUrls: ['./insights-dashboard.css']
})
export class InsightsDashboard implements OnInit {

  insights: FinancialInsights | null = null;
  loading = true;
  error = '';

  chartData: ChartData<'bar'> = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Income vs Expense (Last 6 Months)' }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => '₹' + Number(value).toLocaleString('en-IN')
        }
      }
    }
  };

  constructor(
    private insightsService: InsightsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // ✅ FIX: use getCurrentUser()?.id instead of getCurrentUserId()
    const userId = this.authService.getCurrentUser()?.id;
    if (userId) {
      this.loadInsights(userId);
    }
  }

  loadInsights(userId: number): void {
    this.loading = true;
    this.insightsService.getInsights(userId).subscribe({
      next: (data) => {
        this.insights = data;
        this.buildChart(data);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load insights. Please try again.';
        this.loading = false;
      }
    });
  }

  buildChart(data: FinancialInsights): void {
    this.chartData = {
      labels: data.trendSummary.map(t => t.monthLabel),
      datasets: [
        {
          label: 'Income',
          data: data.trendSummary.map(t => t.totalIncome),
          backgroundColor: 'rgba(46, 125, 50, 0.7)',
          borderColor: '#2E7D32',
          borderWidth: 1
        },
        {
          label: 'Expense',
          data: data.trendSummary.map(t => t.totalExpense),
          backgroundColor: 'rgba(198, 40, 40, 0.7)',
          borderColor: '#C62828',
          borderWidth: 1
        }
      ]
    };
  }

  get savingsIsNegative(): boolean {
    return this.insights ? this.insights.savings < 0 : false;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  }
}