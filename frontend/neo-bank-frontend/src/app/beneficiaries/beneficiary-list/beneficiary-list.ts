import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { BeneficiaryService } from '../../core/services/beneficiary';
import { Beneficiary } from '../../models/beneficiary.model';

@Component({
  selector: 'app-beneficiary-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './beneficiary-list.html',
  styleUrls: ['./beneficiary-list.css']
})
export class BeneficiaryList implements OnInit {

  beneficiaries: Beneficiary[] = [];
  filtered:       Beneficiary[] = [];

  searchQuery  = '';
  filterType   = 'ALL';    // ALL | INTERNAL | EXTERNAL
  filterStatus = 'ALL';    // ALL | ACTIVE | BLOCKED
  showFavOnly  = false;

  loading      = true;
  errorMessage = '';

  // Delete modal state
  showDeleteModal   = false;
  deleteTarget: Beneficiary | null = null;
  deleteInProgress  = false;
  deleteError       = '';

  // Toast
  toastMessage = '';
  toastType    = 'success'; // success | error

  constructor(private beneficiaryService: BeneficiaryService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading      = true;
    this.errorMessage = '';
    this.beneficiaryService.getAll().subscribe({
      next: (list) => {
        this.beneficiaries = list;
        this.applyFilters();
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err?.error?.message ?? 'Unable to load beneficiaries.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filtered = this.beneficiaries.filter(b => {
      const matchSearch = !q ||
        b.nickname.toLowerCase().includes(q)      ||
        b.accountNumber.includes(q)               ||
        b.bankName.toLowerCase().includes(q)      ||
        b.ifscCode.toLowerCase().includes(q);
      const matchType   = this.filterType   === 'ALL' || b.beneficiaryType === this.filterType;
      const matchStatus = this.filterStatus === 'ALL' || b.status          === this.filterStatus;
      const matchFav    = !this.showFavOnly || b.isFavorite;
      return matchSearch && matchType && matchStatus && matchFav;
    });
  }

  toggleFavorite(b: Beneficiary): void {
    this.beneficiaryService.toggleFavorite(b.id).subscribe({
      next: (updated) => {
        const idx = this.beneficiaries.findIndex(x => x.id === updated.id);
        if (idx !== -1) this.beneficiaries[idx] = updated;
        this.applyFilters();
        this.showToast(
          updated.isFavorite ? 'Added to favourites' : 'Removed from favourites',
          'success'
        );
      },
      error: () => this.showToast('Could not update favourite', 'error')
    });
  }

  openDeleteModal(b: Beneficiary): void {
    this.deleteTarget    = b;
    this.showDeleteModal = true;
    this.deleteError     = '';
  }

  closeDeleteModal(): void {
    this.showDeleteModal  = false;
    this.deleteTarget     = null;
    this.deleteInProgress = false;
    this.deleteError      = '';
  }

  confirmDelete(): void {
    if (!this.deleteTarget) return;
    this.deleteInProgress = true;
    this.deleteError      = '';
    this.beneficiaryService.delete(this.deleteTarget.id).subscribe({
      next: () => {
        this.beneficiaries = this.beneficiaries.filter(b => b.id !== this.deleteTarget!.id);
        this.applyFilters();
        this.closeDeleteModal();
        this.showToast('Beneficiary removed successfully', 'success');
      },
      error: (err: HttpErrorResponse) => {
        this.deleteInProgress = false;
        this.deleteError      = err?.error?.message ?? 'Delete failed. Try again.';
      }
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  private showToast(msg: string, type: 'success' | 'error'): void {
    this.toastMessage = msg;
    this.toastType    = type;
    setTimeout(() => this.toastMessage = '', 3500);
  }
}