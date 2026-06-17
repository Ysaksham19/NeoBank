import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminService } from '../../core/services/admin';
import { AdminUser } from '../../models/admin-user.model';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './users-management.html',
  styleUrls: ['./users-management.css']
})
export class UsersManagement implements OnInit {

  users: AdminUser[] = [];

  constructor(
    private adminService: AdminService
  ) {}

  ngOnInit(): void {

    this.loadUsers();

  }

  loadUsers(): void {

    this.adminService
      .getAllUsers()
      .subscribe({

        next: (response) => {

          this.users = response;

        }

      });

  }

  updateStatus(
    userId: number,
    status: string
  ): void {

    this.adminService
      .updateUserStatus(
        userId,
        status
      )
      .subscribe({

        next: () => {

          this.loadUsers();

        }

      });

  }

}