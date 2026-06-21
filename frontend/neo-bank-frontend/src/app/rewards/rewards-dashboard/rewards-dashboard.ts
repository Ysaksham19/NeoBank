import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RewardService } from '../../core/services/reward';

@Component({
  selector: 'app-rewards-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rewards-dashboard.html',
  styleUrls: ['./rewards-dashboard.css']
})
export class RewardsDashboard implements OnInit {

  totalRewards = 0;

  constructor(private rewardService: RewardService) {}

  ngOnInit(): void {
    this.rewardService.getTotalRewards().subscribe({
      next: (response) => { this.totalRewards = response; },
      error: (error) => {
        console.error('Failed to load rewards', error);
        this.totalRewards = 0;
      }
    });
  }
}