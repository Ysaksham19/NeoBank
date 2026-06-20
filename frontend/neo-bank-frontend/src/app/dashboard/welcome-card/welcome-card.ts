import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-welcome-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-card.html',
  styleUrls: ['./welcome-card.css']
})
export class WelcomeCard implements OnInit {
  user: any = null;
  today = new Date();
  greeting = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    const hour = new Date().getHours();
    this.greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  }
}
