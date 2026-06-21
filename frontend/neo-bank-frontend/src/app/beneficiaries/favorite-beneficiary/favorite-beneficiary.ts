import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { BeneficiaryService } from '../../core/services/beneficiary';
import { Beneficiary } from '../../models/beneficiary.model';

@Component({
  selector: 'app-favorite-beneficiary',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorite-beneficiary.html',
  styleUrls: ['./favorite-beneficiary.css']
})
export class FavoriteBeneficiary implements OnInit {

  all:       Beneficiary[] = [];
  favorites: Beneficiary[] = [];

  loading      = true;
  errorMessage = '';
  toastMsg     = '';

  constructor(private svc: BeneficiaryService) {}

  ngOnInit(): void {
    this.svc.getAll().subscribe({
      next: (list) => {
        this.all       = list;
        this.favorites = list.filter(b => b.isFavorite);
        this.loading   = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err?.error?.message ?? 'Unable to load favourites.';
        this.loading = false;
      }
    });
  }

  removeFavorite(b: Beneficiary): void {
    this.svc.toggleFavorite(b.id).subscribe({
      next: (updated) => {
        const idx = this.all.findIndex(x => x.id === updated.id);
        if (idx !== -1) this.all[idx] = updated;
        this.favorites = this.all.filter(x => x.isFavorite);
        this.toast('Removed from favourites');
      },
      error: () => this.toast('Could not update favourite')
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  private toast(msg: string): void {
    this.toastMsg = msg;
    setTimeout(() => this.toastMsg = '', 3000);
  }
}