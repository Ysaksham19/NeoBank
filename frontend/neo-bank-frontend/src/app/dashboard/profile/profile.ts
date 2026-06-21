import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProfileResponse, ProfileAccount } from '../../models/profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe],
  templateUrl:'./profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {

  profile: ProfileResponse | null = null;
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void { this.loadProfile(); }

  loadProfile(): void {
    this.loading = true;
    this.error = '';
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<ProfileResponse>('/api/v1/users/me', { headers }).subscribe({
      next: (data) => { this.profile = data; this.loading = false; },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load profile.';
        this.loading = false;
      }
    });
  }

  get isAdmin(): boolean {
    return this.profile?.roles?.some(r => r === 'ROLE_ADMIN' || r === 'ADMIN') ?? false;
  }

  get primaryAccount(): ProfileAccount | null {
    return (this.profile?.accounts?.length ?? 0) > 0
      ? this.profile!.accounts[0]
      : null;
  }

  get displayRole(): string {
    return this.isAdmin ? 'Administrator' : 'NeoBank Customer';
  }

  get avatarInitial(): string {
    return this.profile?.fullName?.charAt(0)?.toUpperCase() ?? '?';
  }

  // Maps backend field name: customerId → shown as "Customer No"
  get customerNo(): string {
    return (this.profile as any)?.customerId
      || (this.profile as any)?.customerNo
      || '—';
  }

  statusClass(value: string): string {
    switch (value?.toUpperCase()) {
      case 'ACTIVE':   return 'pill--success';
      case 'ACCEPTED': return 'pill--success';
      case 'PENDING':  return 'pill--warning';
      case 'INACTIVE': return 'pill--warning';
      case 'REJECTED':
      case 'BLOCKED':
      case 'LOCKED':   return 'pill--danger';
      default:         return '';
    }
  }
}