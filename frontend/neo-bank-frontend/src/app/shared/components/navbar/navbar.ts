import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth';

interface NavChildItem {
  label: string;
  route: string;
  description?: string;
}

interface NavItem {
  key: string;
  label: string;
  route: string;
  children?: NavChildItem[];
}

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly elementRef = inject(ElementRef);
  private readonly router = inject(Router);

  mobileMenuOpen = false;
  profileDropdownOpen = false;
  notificationsDropdownOpen = false;
  activeMegaMenu: string | null = null;
  isScrolled = false;
  currentUrl = '';
  currentFragment = '';

  readonly publicNavItems: NavItem[] = [
    {
      key: 'personal',
      label: 'Personal Banking',
      route: '/personal-banking',
      children: [
        {
          label: 'Savings Account',
          route: '/personal-banking/savings-account',
          description: 'Smart everyday banking with secure digital access.'
        },
        {
          label: 'Current Account',
          route: '/personal-banking/current-account',
          description: 'Flexible banking for frequent transactions.'
        },
        {
          label: 'Fixed Deposits',
          route: '/personal-banking/fixed-deposits',
          description: 'Stable returns with flexible deposit tenure.'
        },
        {
          label: 'Debit Cards',
          route: '/personal-banking/debit-cards',
          description: 'Secure spending with rewards and control features.'
        }
      ]
    },
    {
      key: 'business',
      label: 'Business Banking',
      route: '/business-banking',
      children: [
        {
          label: 'Business Accounts',
          route: '/business-banking/accounts',
          description: 'Built for startups, SMEs, and growing enterprises.'
        },
        {
          label: 'Merchant Payments',
          route: '/business-banking/merchant-payments',
          description: 'Accept payments online and in-store with ease.'
        },
        {
          label: 'Payroll Services',
          route: '/business-banking/payroll',
          description: 'Automate salary payouts and team banking workflows.'
        },
        {
          label: 'Working Capital',
          route: '/business-banking/working-capital',
          description: 'Funding support for day-to-day business operations.'
        }
      ]
    },
    {
      key: 'loans',
      label: 'Loans',
      route: '/loans',
      children: [
        {
          label: 'Personal Loan',
          route: '/loans/personal-loan',
          description: 'Fast approval for lifestyle and personal needs.'
        },
        {
          label: 'Home Loan',
          route: '/loans/home-loan',
          description: 'Flexible home finance with attractive rates.'
        },
        {
          label: 'Car Loan',
          route: '/loans/car-loan',
          description: 'Drive your next car home with simple financing.'
        },
        {
          label: 'Education Loan',
          route: '/loans/education-loan',
          description: 'Support higher studies with student-friendly plans.'
        }
      ]
    },
    {
      key: 'cards',
      label: 'Cards',
      route: '/cards',
      children: [
        {
          label: 'Credit Cards',
          route: '/cards/credit-cards',
          description: 'Premium benefits, cashback, and travel rewards.'
        },
        {
          label: 'Debit Cards',
          route: '/cards/debit-cards',
          description: 'Everyday payments with advanced security controls.'
        },
        {
          label: 'Prepaid Cards',
          route: '/cards/prepaid-cards',
          description: 'Controlled spending for gifting and travel needs.'
        },
        {
          label: 'Card Offers',
          route: '/cards/offers',
          description: 'Explore partner discounts and seasonal deals.'
        }
      ]
    },
    {
      key: 'investments',
      label: 'Investments',
      route: '/investments',
      children: [
        {
          label: 'Mutual Funds',
          route: '/investments/mutual-funds',
          description: 'Diversified investing for long-term growth.'
        },
        {
          label: 'SIP Plans',
          route: '/investments/sip-plans',
          description: 'Build disciplined wealth through monthly investing.'
        },
        {
          label: 'Fixed Income',
          route: '/investments/fixed-income',
          description: 'Stable and conservative options for steady returns.'
        },
        {
          label: 'Wealth Advisory',
          route: '/investments/wealth-advisory',
          description: 'Guided portfolio planning for your financial goals.'
        }
      ]
    },
    {
      key: 'insurance',
      label: 'Insurance',
      route: '/insurance',
      children: [
        {
          label: 'Life Insurance',
          route: '/insurance/life',
          description: 'Long-term protection for you and your family.'
        },
        {
          label: 'Health Insurance',
          route: '/insurance/health',
          description: 'Medical protection with flexible coverage options.'
        },
        {
          label: 'Vehicle Insurance',
          route: '/insurance/vehicle',
          description: 'Complete coverage for cars and two-wheelers.'
        },
        {
          label: 'Travel Insurance',
          route: '/insurance/travel',
          description: 'Travel confidently with global trip protection.'
        }
      ]
    },
    {
      key: 'support',
      label: 'Support',
      route: '/support',
      children: [
        {
          label: 'Help Center',
          route: '/support/help-center',
          description: 'Find answers, guides, and self-service support.'
        },
        {
          label: 'Branch Locator',
          route: '/support/branch-locator',
          description: 'Locate nearby branches and service points instantly.'
        },
        {
          label: 'Contact Us',
          route: '/support/contact-us',
          description: 'Reach our team for account and service assistance.'
        },
        {
          label: 'FAQs',
          route: '/support/faqs',
          description: 'Quick answers to the most common questions.'
        }
      ]
    }
  ];

  readonly privateNavItems: NavItem[] = [
    { key: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { key: 'accounts', label: 'Accounts', route: '/accounts' },
    { key: 'transactions', label: 'Transactions', route: '/transactions' },
    { key: 'cards', label: 'Cards', route: '/cards' },
    { key: 'payments', label: 'Payments', route: '/payments' },
    { key: 'support', label: 'Support', route: '/support' }
  ];

  notifications: NotificationItem[] = [
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

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const tree = this.router.parseUrl(this.router.url);
        this.currentUrl = this.router.url.split('#')[0];
        this.currentFragment = tree.fragment || '';
        this.closeAllMenus();
      });
  }

  get user() {
    return this.authService.getCurrentUser();
  }

  get unreadCount(): number {
    return this.notifications.filter(item => !item.read).length;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isRouteActive(route: string): boolean {
    return this.currentUrl === route || this.currentUrl.startsWith(route + '/');
  }

  openMegaMenu(key: string): void {
    if (this.mobileMenuOpen || this.isLoggedIn()) return;
    this.activeMegaMenu = key;
  }

  closeMegaMenu(): void {
    this.activeMegaMenu = null;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.profileDropdownOpen = false;
    this.notificationsDropdownOpen = false;
    this.activeMegaMenu = null;
  }

  toggleProfileDropdown(event: Event): void {
    event.stopPropagation();
    this.profileDropdownOpen = !this.profileDropdownOpen;
    this.notificationsDropdownOpen = false;
    this.mobileMenuOpen = false;
    this.activeMegaMenu = null;
  }

  toggleNotificationsDropdown(event: Event): void {
    event.stopPropagation();
    this.notificationsDropdownOpen = !this.notificationsDropdownOpen;
    this.profileDropdownOpen = false;
    this.mobileMenuOpen = false;
    this.activeMegaMenu = null;
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map(item => ({
      ...item,
      read: true
    }));
  }

  goToSearch(): void {
    this.closeAllMenus();
    this.router.navigate(['/search']);
  }

  logout(): void {
    this.closeAllMenus();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  closeAllMenus(): void {
    this.mobileMenuOpen = false;
    this.profileDropdownOpen = false;
    this.notificationsDropdownOpen = false;
    this.activeMegaMenu = null;
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 12;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeAllMenus();
    }
  }
}