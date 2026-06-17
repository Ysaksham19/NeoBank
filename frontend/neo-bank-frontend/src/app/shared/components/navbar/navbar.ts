import { Component, inject, HostListener, ElementRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth';

import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './navbar.html',

  styleUrls: ['./navbar.css']
})
export class Navbar {

  /* =========================================================
     SERVICES
  ========================================================= */

  private authService =
    inject(AuthService);

  private elementRef =
    inject(ElementRef);

  private router =
    inject(Router);

  /* =========================================================
     STATES
  ========================================================= */

  mobileMenuOpen = false;
  profileDropdownOpen = false;
  notificationsDropdownOpen = false;
  isScrolled = false;
  currentFragment = '';

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const tree = this.router.parseUrl(this.router.url);
      this.currentFragment = tree.fragment || '';
    });
  }

  /* =========================================================
     NOTIFICATIONS DATA
  ========================================================= */

  notifications = [
    {
      id: 1,
      title: 'Transfer Received',
      message: 'You received ₹10,000 from Rohit S.',
      time: '2 mins ago',
      read: false
    },
    {
      id: 2,
      title: 'Bill Payment Alert',
      message: 'Electricity bill of ₹1,420 is due in 3 days.',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      title: 'Cashback Reward',
      message: 'You earned ₹250 cashback on your last spend.',
      time: '5 hours ago',
      read: true
    }
  ];

  /* =========================================================
     GETTERS
  ========================================================= */

  get user() {

    return this.authService
      .getCurrentUser();
  }

  get unreadCount(): number {

    return this.notifications
      .filter(n => !n.read).length;
  }



  /* =========================================================
     AUTH CHECK
  ========================================================= */

  isLoggedIn(): boolean {

    return this.authService
      .isLoggedIn();
  }

  /* =========================================================
     ACTIONS
  ========================================================= */

  toggleMobileMenu(): void {

    this.mobileMenuOpen =
      !this.mobileMenuOpen;

    this.profileDropdownOpen = false;
    this.notificationsDropdownOpen = false;
  }

  toggleProfileDropdown(event: Event): void {

    event.stopPropagation();

    this.profileDropdownOpen =
      !this.profileDropdownOpen;

    this.notificationsDropdownOpen = false;
    this.mobileMenuOpen = false;
  }

  toggleNotificationsDropdown(event: Event): void {

    event.stopPropagation();

    this.notificationsDropdownOpen =
      !this.notificationsDropdownOpen;

    this.profileDropdownOpen = false;
    this.mobileMenuOpen = false;
  }

  markAllAsRead(): void {

    this.notifications
      .forEach(n => n.read = true);
  }

  logout(): void {

    this.profileDropdownOpen = false;
    this.authService.logout();
  }

  /* =========================================================
     LISTENERS
  ========================================================= */

  @HostListener('window:scroll', [])
  onWindowScroll(): void {

    this.isScrolled =
      window.scrollY > 20;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {

    if (!this.elementRef.nativeElement.contains(event.target)) {

      this.profileDropdownOpen = false;
      this.notificationsDropdownOpen = false;
      this.mobileMenuOpen = false;
    }
  }
}