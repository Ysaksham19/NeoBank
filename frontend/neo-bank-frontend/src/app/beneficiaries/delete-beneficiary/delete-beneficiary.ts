import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { BeneficiaryService } from '../../core/services/beneficiary';
import { Beneficiary } from '../../models/beneficiary.model';

@Component({
  selector: 'app-delete-beneficiary',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './delete-beneficiary.html',
  styleUrls: ['./delete-beneficiary.css']
})
export class DeleteBeneficiary implements OnInit {

  beneficiary: Beneficiary | null = null;
  loading    = true;
  deleting   = false;
  error      = '';

  constructor(
    private route:  ActivatedRoute,
    private svc:    BeneficiaryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.getById(id).subscribe({
      next:  (b)                    => { this.beneficiary = b; this.loading = false; },
      error: (err: HttpErrorResponse) => {
        this.error   = err?.error?.message ?? 'Beneficiary not found.';
        this.loading = false;
      }
    });
  }

  confirm(): void {
    if (!this.beneficiary) return;
    this.deleting = true;
    this.error    = '';
    this.svc.delete(this.beneficiary.id).subscribe({
      next:  ()                     => this.router.navigate(['/beneficiaries'], { queryParams: { deleted: 1 } }),
      error: (err: HttpErrorResponse) => {
        this.deleting = false;
        this.error    = err?.error?.message ?? 'Could not remove beneficiary.';
      }
    });
  }
}