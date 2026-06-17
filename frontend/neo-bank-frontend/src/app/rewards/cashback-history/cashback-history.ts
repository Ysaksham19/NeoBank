import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Reward } from '../../models/reward.model';
import { RewardService } from '../../core/services/reward';

@Component({
  selector: 'app-cashback-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cashback-history.html',
  styleUrls: ['./cashback-history.css']
})
export class CashbackHistory implements OnInit {

  rewards: Reward[] = [];

  constructor(
    private rewardService: RewardService
  ) {}

  ngOnInit(): void {

    this.rewardService
      .getRewards()
      .subscribe({

        next: (response) => {

          this.rewards = response;

        }

      });

  }

}