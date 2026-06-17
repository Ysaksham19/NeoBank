import {
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

import { AnalyticsService } from '../../core/services/analytics';
import { Analytics } from '../../models/analytics.model';

Chart.register(
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css']
})
export class AnalyticsComponent
implements OnInit, AfterViewInit {

  analytics: Analytics[] = [];

  constructor(
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {

    this.analyticsService
      .getMonthlySpending()
      .subscribe({

        next: (response) => {

          this.analytics = response;

          this.createChart();

        }

      });

  }

  ngAfterViewInit(): void {}

  createChart(): void {

    new Chart('analyticsChart', {

      type: 'doughnut',

      data: {

        labels:
          this.analytics.map(a => a.category),

        datasets: [

          {
            data:
              this.analytics.map(a => a.amount),

            backgroundColor: [
              '#14d8ff',
              '#8b5cf6',
              '#22c55e',
              '#f59e0b',
              '#ef4444'
            ]
          }

        ]

      }

    });

  }

}