import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminDashboardService } from '../../core/services/admin-dashboard';
import { SystemHealth } from '../../models/admin.model';

@Component({
  selector: 'app-system-health',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './system-health.html',
  styleUrls: ['./system-health.css']
})
export class SystemHealthComponent implements OnInit {

  health: SystemHealth | null = null;
  loading = true;

  constructor(private adminService: AdminDashboardService) {}

  ngOnInit(): void { this.fetchHealth(); }

  fetchHealth(): void {
    this.loading = true;
    this.adminService.getSystemHealth().subscribe({
      next: (data) => { this.health = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  formatUptime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  }
}