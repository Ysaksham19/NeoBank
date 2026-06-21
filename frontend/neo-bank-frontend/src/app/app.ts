import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { Header } from './shared/components/header/header'; 
import { AuthService } from './core/services/auth';    // ← add this

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,Navbar,Header],
  templateUrl: './app.html'
})
export class App{

    constructor(public router: Router, private authService: AuthService) {}  // ← inject AuthService

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();   // ← add this method
  }


  showNavbar(): boolean {

    return !(
        this.router.url.startsWith('/login') ||
        this.router.url.startsWith('/register') ||
        this.router.url.startsWith('/forgot-password') ||
        this.router.url.startsWith('/admin')  ||
        this.router.url.startsWith('/dashboard') ||
        this.router.url.startsWith('/accounts') ||
        this.router.url.startsWith('/transactions') ||
        this.router.url.startsWith('/transfer-money') ||
        this.router.url.startsWith('/beneficiaries') ||
        this.router.url.startsWith('/bills') ||
        this.router.url.startsWith('/budgets') ||
        this.router.url.startsWith('/cards') ||
        this.router.url.startsWith('/profile') ||
        this.router.url.startsWith('/settings') ||
        this.router.url.startsWith('/rewards')
      );

  }

  isAuthPage(): boolean {
    return (
      this.router.url.startsWith('/login') ||
      this.router.url.startsWith('/register') ||
      this.router.url.startsWith('/forgot-password')
    );
  }
}
