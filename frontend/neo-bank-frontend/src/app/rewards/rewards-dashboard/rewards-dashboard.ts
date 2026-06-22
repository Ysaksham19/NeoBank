import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

import { Reward } from '../../models/reward.model';
import { RewardService } from '../../core/services/reward';

// Mirrors backend RewardType.java enum exactly
export type RewardTypeFilter = 'ALL' | 'CASHBACK' | 'REWARD_POINTS';

@Component({
  selector: 'app-rewards-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rewards-dashboard.html',
  styleUrls: ['./rewards-dashboard.css']
})
export class RewardsDashboard implements OnInit {

  rewards:      Reward[] = [];
  totalRewards  = 0;
  isLoading     = true;
  activeTab: 'overview' | 'history' = 'overview';

  // Union now matches backend enum — no BONUS/REFERRAL/LOYALTY
  historyFilter: RewardTypeFilter = 'ALL';
  sortOrder: 'newest' | 'oldest' | 'highest' | 'lowest' = 'newest';

  readonly tiers = [
    { name: 'Bronze',   min: 0,    max: 500,   color: '#cd7f32', icon: '🥉',
      perks: ['Up to 3% bill cashback', 'Basic rewards tracking'] },
    { name: 'Silver',   min: 500,  max: 2000,  color: '#9e9e9e', icon: '🥈',
      perks: ['Up to 3% bill cashback', 'Priority support', 'Monthly summary'] },
    { name: 'Gold',     min: 2000, max: 5000,  color: '#ffd700', icon: '🥇',
      perks: ['Up to 3% bill cashback', 'Dedicated support', 'Exclusive offers'] },
    { name: 'Platinum', min: 5000, max: 99999, color: '#7b9cff', icon: '💎',
      perks: ['Up to 3% bill cashback', 'Concierge support', 'Premium benefits', 'Zero forex'] },
  ];

  constructor(
    private rewardService: RewardService,
    private location: Location
  ) {}

  ngOnInit(): void { this.loadData(); }

  loadData(): void {
    this.isLoading = true;
    this.rewardService.getRewards().subscribe({
      next: (res) => {
        this.rewards      = res;
        this.totalRewards = res.reduce((s, r) => s + Number(r.amount), 0);
        this.isLoading    = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  // ── Tier logic ──────────────────────────────────────────────

  get currentTier() {
    return this.tiers.find(t =>
      this.totalRewards >= t.min && this.totalRewards < t.max
    ) ?? this.tiers[0];
  }

  get nextTier() {
    const idx = this.tiers.indexOf(this.currentTier);
    return idx < this.tiers.length - 1 ? this.tiers[idx + 1] : null;
  }

  get tierProgress(): number {
    const t = this.currentTier;
    if (t.name === 'Platinum') return 100;
    return Math.min(100, Math.round(
      ((this.totalRewards - t.min) / (t.max - t.min)) * 100
    ));
  }

  get amountToNextTier(): number {
    return this.nextTier ? this.nextTier.min - this.totalRewards : 0;
  }

  // ── Filtered + sorted history ────────────────────────────────

  get filteredHistory(): Reward[] {
    let list = this.historyFilter === 'ALL'
      ? [...this.rewards]
      : this.rewards.filter(r => r.rewardType === this.historyFilter);

    switch (this.sortOrder) {
      case 'newest':  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':  return list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'highest': return list.sort((a, b) => Number(b.amount) - Number(a.amount));
      case 'lowest':  return list.sort((a, b) => Number(a.amount) - Number(b.amount));
      default:        return list;
    }
  }

  get filteredTotal(): number {
    return this.filteredHistory.reduce((s, r) => s + Number(r.amount), 0);
  }

  // ── Summary stats ────────────────────────────────────────────

  get thisMonthEarned(): number {
    const now = new Date();
    return this.rewards
      .filter(r => {
        const d = new Date(r.createdAt);
        return d.getMonth() === now.getMonth() &&
               d.getFullYear() === now.getFullYear();
      })
      .reduce((s, r) => s + Number(r.amount), 0);
  }

  get lastMonthEarned(): number {
    const now = new Date();
    const lastMonth     = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    return this.rewards
      .filter(r => {
        const d = new Date(r.createdAt);
        return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
      })
      .reduce((s, r) => s + Number(r.amount), 0);
  }

  get rewardTypeBreakdown(): { type: string; total: number; count: number; icon: string }[] {
    const map: Record<string, { total: number; count: number; icon: string }> = {};
    for (const r of this.rewards) {
      if (!map[r.rewardType]) {
        map[r.rewardType] = { total: 0, count: 0, icon: this.typeIcon(r.rewardType) };
      }
      map[r.rewardType].total += Number(r.amount);
      map[r.rewardType].count++;
    }
    return Object.entries(map)
      .map(([type, v]) => ({ type, ...v }))
      .sort((a, b) => b.total - a.total);
  }

  // Returns only types that exist in actual data, typed as RewardTypeFilter
  get uniqueTypes(): RewardTypeFilter[] {
    return [...new Set(this.rewards.map(r => r.rewardType))] as RewardTypeFilter[];
  }

  // ── Safe filter setter — avoids TS2322 in template ───────────
  // Template calls setFilter(type) instead of direct assignment
  // because `type` is string but historyFilter is a strict union

  setFilter(value: string): void {
    const allowed: RewardTypeFilter[] = ['ALL', 'CASHBACK', 'REWARD_POINTS'];
    if (allowed.includes(value as RewardTypeFilter)) {
      this.historyFilter = value as RewardTypeFilter;
    }
  }

  // ── Grouped history by date ──────────────────────────────────

  get groupedHistory(): { label: string; items: Reward[] }[] {
    const groups: Record<string, Reward[]> = {};
    for (const r of this.filteredHistory) {
      const label = this.getDateGroupLabel(r.createdAt);
      if (!groups[label]) groups[label] = [];
      groups[label].push(r);
    }
    return Object.entries(groups).map(([label, items]) => ({ label, items }));
  }

  private getDateGroupLabel(dateStr: string): string {
    const date      = new Date(dateStr);
    const today     = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString())     return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    const diffDays = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays <= 7) return 'This Week';

    return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }

  // ── Display helpers ──────────────────────────────────────────

  typeIcon(type: string): string {
    const icons: Record<string, string> = {
      CASHBACK:      '💸',
      REWARD_POINTS: '⭐',
    };
    return icons[type] ?? '🏅';
  }

  typeLabel(type: string): string {
    const labels: Record<string, string> = {
      CASHBACK:      'Bill Cashback',
      REWARD_POINTS: 'Reward Points',
    };
    return labels[type] ?? type;
  }

  formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  goBack(): void { this.location.back(); }
}