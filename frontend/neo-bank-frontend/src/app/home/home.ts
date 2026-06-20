import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  features = [
  {
    icon: '🏦',
    theme: 'blue',
    title: 'Savings Account',
    description: 'High interest rates and zero hidden charges.',
    link: '/register'
  },
  {
    icon: '💳',
    theme: 'green',
    title: 'Current Account',
    description: 'Tailored for businesses of all sizes.',
    link: '/register'
  },
  {
    icon: '✳️',
    theme: 'purple',
    title: 'Fixed Deposit',
    description: 'Higher returns with flexible tenure options.',
    link: '/login'
  },
  {
    icon: '💳',
    theme: 'orange',
    title: 'Credit Cards',
    description: 'Exclusive rewards and exciting offers.',
    link: '/login'
  },
  {
    icon: '💰',
    theme: 'blue',
    title: 'Loans',
    description: 'Personal, Home, Car and Business Loans.',
    link: '/login'
  },
  {
    icon: '📈',
    theme: 'green',
    title: 'Investments',
    description: 'Grow your wealth with smart investments.',
    link: '/login'
  }
];

  stats = [
    {
      icon: '👥',
      value: '10M+',
      label: 'Happy Customers'
    },
    {
      icon: '📍',
      value: '5000+',
      label: 'Branches Across India'
    },
    {
      icon: '⇄',
      value: '₹50,000 Cr+',
      label: 'Transactions Processed'
    },
    {
      icon: '🛡️',
      value: '99.99%',
      label: 'Uptime You Can Trust'
    }
  ];

  aboutFeatures = [
    'Trusted by 1M+ users across India',
    'AI-powered financial analytics',
    'Real-time transaction monitoring',
    'Enterprise-grade security infrastructure'
  ];

  securityFeatures = [
    {
      icon: '🔐',
      title: 'JWT Authentication',
      description: 'Secure login sessions with encrypted token-based authentication.'
    },
    {
      icon: '📱',
      title: 'OTP Verification',
      description: 'Two-factor verification for every critical banking action.'
    },
    {
      icon: '🛡️',
      title: 'Fraud Detection',
      description: 'AI-based suspicious activity monitoring and fraud prevention.'
    },
    {
      icon: '🔒',
      title: '256-bit Encryption',
      description: 'Military-grade encryption protecting all transactions.'
    }
  ];
}