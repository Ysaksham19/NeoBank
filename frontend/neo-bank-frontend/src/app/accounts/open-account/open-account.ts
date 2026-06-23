import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AccountStateService } from '../../core/services/account-state';
import { AuthService } from '../../core/services/auth';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-open-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './open-account.html',
  styleUrls: ['./open-account.css']
})
export class OpenAccount implements OnInit {
  selectedType  = 'SAVINGS';
  loading       = false;
  loadingBranch = true;
  showToast     = false;
  errorMessage  = '';
  createdAccountNumber = '';

  userBranchId  : number | null = null;
  userBranchName = '';
  userBranchIfsc = '';

  constructor(
    private accountState : AccountStateService,
    private authService  : AuthService,
    private router       : Router,
    private http         : HttpClient
  ) {}

  ngOnInit(): void {
    this.resolveBranch();
  }

  resolveBranch(): void {
    this.loadingBranch = true;

    // Read user from storage — has branchName, branchCode, ifscCode but NO branchId
    const user = this.authService.getCurrentUser();
    const branchName = user?.branchName ?? user?.branch_name ?? '';
    const branchCode = user?.branchCode ?? user?.branch_code ?? '';

    console.log('User branchName:', branchName, '| branchCode:', branchCode);

    // Fetch all branches and match by branchCode or branchName to get the ID
    this.http.get<any[]>(`${environment.apiUrl}/branches`).subscribe({
      next: (branches) => {
        console.log('Branches:', JSON.stringify(branches));

        const matched = branches.find(b =>
          (branchCode && (b.branchCode === branchCode || b.code === branchCode || b.branch_code === branchCode)) ||
          (branchName && (b.branchName === branchName || b.name === branchName   || b.branch_name === branchName))
        );

        if (matched) {
          this.userBranchId   = matched.id        ?? matched.branchId   ?? null;
          this.userBranchName = matched.branchName ?? matched.name       ?? branchName;
          this.userBranchIfsc = matched.ifscCode   ?? matched.ifsc       ?? user?.ifscCode ?? '';
          console.log('Matched branch:', this.userBranchId, this.userBranchName);
        } else if (branches.length > 0) {
          // Fallback: use first branch
          const first = branches[0];
          this.userBranchId   = first.id        ?? first.branchId   ?? null;
          this.userBranchName = first.branchName ?? first.name       ?? branchName;
          this.userBranchIfsc = first.ifscCode   ?? first.ifsc       ?? '';
          console.warn('No branch matched — using first branch:', this.userBranchId);
        }

        this.loadingBranch = false;
      },
      error: (err) => {
        console.error('Branches API failed:', err.status);
        // Branches endpoint failed — try account[0] as last resort
        this.fallbackFromAccount(user, branchName);
      }
    });
  }

  private fallbackFromAccount(user: any, branchName: string): void {
    this.http.get<any[]>(`${environment.apiUrl}/accounts`).subscribe({
      next: (accounts) => {
        if (accounts.length > 0) {
          const a = accounts[0];
          // Try every possible field name
          this.userBranchId   = a.branchId   ?? a.branch_id   ?? a.branch?.id   ?? null;
          this.userBranchName = a.branchName  ?? a.branch_name ?? a.branch?.name ?? branchName;
          this.userBranchIfsc = a.ifscCode    ?? a.ifsc_code   ?? a.branch?.ifscCode
                              ?? user?.ifscCode ?? '';
        }
        // If STILL no branchId — show user the branch name at least and block submit
        if (!this.userBranchId && branchName) {
          this.userBranchName = branchName;
          this.userBranchIfsc = user?.ifscCode ?? '';
        }
        this.loadingBranch = false;
      },
      error: () => { this.loadingBranch = false; }
    });
  }

  resetForm(): void {
    this.selectedType = 'SAVINGS';
    this.errorMessage = '';
    this.createdAccountNumber = '';
  }

  submitApplication(): void {
    if (!this.selectedType) {
      this.errorMessage = 'Please select an account type.'; return;
    }
    if (!this.userBranchId) {
      this.errorMessage = 'Branch ID could not be resolved. Please contact support.'; return;
    }

    const payload = {
      accountType : this.selectedType,
      branchId    : Number(this.userBranchId)
    };

    console.log('POST payload:', JSON.stringify(payload));

    this.errorMessage = '';
    this.loading = true;

    this.http.post<any>(`${environment.apiUrl}/accounts`, payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.createdAccountNumber = res?.accountNumber ?? res?.accountNo ?? '';
        this.showToast = true;
        this.accountState.loadAccounts();
        setTimeout(() => {
          this.showToast = false;
          this.router.navigate(['/accounts']);
        }, 3000);
      },
      error: (err) => {
        this.loading = false;
        const details = err?.error?.details;
        if (details && typeof details === 'object') {
          this.errorMessage = Object.entries(details)
            .map(([f, m]) => `${f}: ${m}`).join(' | ');
        } else {
          this.errorMessage = err?.error?.message
            ?? JSON.stringify(err?.error)
            ?? 'Failed to open account.';
        }
      }
    });
  }
}