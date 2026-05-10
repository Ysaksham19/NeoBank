import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {

  constructor(private router: Router) {}

    securityFeatures = [
    {
      icon: '🔐',
      title: 'Your Login is Always Safe',
      desc: 'Every time you sign in, we create a unique secure key that expires automatically — so even if someone steals it, it becomes useless in minutes.'
    },
    {
      icon: '📱',
      title: 'We Verify It\'s Really You',
      desc: 'Before any important action, we send a one-time password (OTP) to your phone or email — making sure only you can access your account.'
    },
    {
      icon: '🛡️',
      title: 'We Watch for Suspicious Activity',
      desc: 'Our system monitors every transaction 24/7. If something looks unusual — like a large transfer from a new device — we flag it instantly.'
    },
    {
      icon: '🔑',
      title: 'Your Password is Never Stored',
      desc: 'We never save your actual password anywhere. It\'s converted into an unreadable code — so even our own team can\'t see it.'
    }
  ];

    features = [
      { icon: '🔒', title: 'Bank-Grade Security', desc: 'JWT-secured sessions, OTP verification, and end-to-end encryption keep your money safe.' },
      { icon: '⚡', title: 'Instant Transfers', desc: 'Send money to any account in seconds. NEFT, RTGS, and IMPS all in one place.' },
      { icon: '📊', title: 'Smart Dashboard', desc: 'Real-time balance updates, transaction history, and spending insights at a glance.' },
      { icon: '📱', title: 'Always Accessible', desc: 'Manage your finances 24/7 from any device, anywhere in the world.' },
      { icon: '🧾', title: 'Full Transparency', desc: 'Every transaction logged with reference numbers, timestamps, and full audit trail.' },
      { icon: '🏦', title: 'Multiple Accounts', desc: 'Savings, Current, and Salary accounts — open and manage them all in one app.' }
    ];

  accountTypes = [
    {
      type: 'SAVINGS',
      icon: '💰',
      bgStyle: 'background: linear-gradient(to bottom right, #14b8a6, #0f766e)',
      badge: 'Most Popular',
      minBalance: '₹1,000',
      interest: '4.5% p.a.',
      benefits: ['Free debit card', 'Unlimited ATM withdrawals', 'Online banking access', 'Auto-sweep facility']
    },
    {
      type: 'CURRENT',
      icon: '🏢',
      bgStyle: 'background: linear-gradient(to bottom right, #3b82f6, #1d4ed8)',
      badge: 'Business',
      minBalance: '₹10,000',
      interest: 'No interest',
      benefits: ['Unlimited transactions', 'Overdraft facility', 'Business debit card', 'Priority support']
    },
    {
      type: 'SALARY',
      icon: '💼',
      bgStyle: 'background: linear-gradient(to bottom right, #a855f7, #7c3aed)',
      badge: 'Zero Balance',
      minBalance: '₹0',
      interest: '3.5% p.a.',
      benefits: ['Zero minimum balance', 'Salary advance', 'Free insurance cover', 'Exclusive offers']
    }
  ];

  stats = [
    { value: '1M+',    label: 'Active Users' },
    { value: '₹500Cr+', label: 'Daily Transactions' },
    { value: '99.9%',  label: 'Uptime SLA' },
    { value: '256-bit', label: 'SSL Encryption' }
  ];

  goToLogin()    { this.router.navigate(['/auth/login']); }
  goToRegister() { this.router.navigate(['/auth/register']); }
}