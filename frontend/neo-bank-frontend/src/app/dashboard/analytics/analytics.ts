import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { AnalyticsService } from '../../core/services/analytics';
import { Analytics } from '../../models/analytics.model';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css']
})
export class AnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
  analytics: Analytics[] = [];
  private chartInstance?: Chart;
  private dataReady = false;
  private viewReady = false;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.analyticsService.getMonthlySpending().subscribe({
      next: (response) => {
        this.analytics = response;
        this.dataReady = true;
        // FIX #11 — only render if view is also ready
        if (this.viewReady) this.createChart();
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    // FIX #11 — if data arrived before view, render now
    if (this.dataReady) this.createChart();
  }

  ngOnDestroy(): void {
    // FIX #11 — destroy chart instance to prevent 'canvas already in use'
    this.chartInstance?.destroy();
  }

  createChart(): void {
    this.chartInstance?.destroy();
    this.chartInstance = new Chart('analyticsChart', {
      type: 'doughnut',
      data: {
        labels: this.analytics.map(a => a.category),
        datasets: [{
          data: this.analytics.map(a => a.amount),
          backgroundColor: ['#14d8ff', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444']
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  }
}
