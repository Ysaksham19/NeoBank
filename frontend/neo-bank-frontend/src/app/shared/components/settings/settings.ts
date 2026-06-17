import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class Settings {

  emailAlerts = true;

  smsAlerts = true;

  pushNotifications = true;

  hideBalance = false;

  darkMode = true;

  selectedLanguage = 'English';

  constructor(
    private authService: AuthService
  ) {}

  logout(): void {

    this.authService.logout();

  }

}