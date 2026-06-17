import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './home.html',

  styleUrls: ['./home.css']
})
export class Home {

  /* =========================================================
     FEATURES
  ========================================================= */

  features = [

    {
      icon: '🔒',

      title: 'Bank-Grade Security',

      description:
        'Advanced JWT authentication, OTP verification, and encrypted transactions.'
    },

    {
      icon: '⚡',

      title: 'Instant Transfers',

      description:
        'Transfer money instantly between accounts with real-time updates.'
    },

    {
      icon: '📊',

      title: 'Smart Analytics',

      description:
        'Track spending, monitor budgets, and view financial insights.'
    },

    {
      icon: '🏦',

      title: 'Multi Account Banking',

      description:
        'Savings, Current, Salary accounts all managed in one dashboard.'
    }
  ];

  /* =========================================================
     STATS
  ========================================================= */

  stats = [

    {
      value: '1M+',
      label: 'Users'
    },

    {
      value: '₹500Cr+',
      label: 'Transactions'
    },

    {
      value: '99.9%',
      label: 'Uptime'
    },

    {
      value: '256-bit',
      label: 'Encryption'
    }
  ];

  /* =========================================================
   ABOUT US
========================================================= */

  aboutFeatures = [

    'Trusted by 1M+ users across India',

    'AI-powered financial analytics',

    'Real-time transaction monitoring',

    'Enterprise-grade security infrastructure'
  ];


  /* =========================================================
    SECURITY FEATURES
  ========================================================= */

  securityFeatures = [

    {
      icon: '🔐',

      title: 'JWT Authentication',

      description:
        'Secure login sessions with encrypted token-based authentication.'
    },

    {
      icon: '📱',

      title: 'OTP Verification',

      description:
        'Two-factor verification for every critical banking action.'
    },

    {
      icon: '🛡️',

      title: 'Fraud Detection',

      description:
        'AI-based suspicious activity monitoring and fraud prevention.'
    },

    {
      icon: '🔒',

      title: '256-bit Encryption',

      description:
        'Military-grade encryption protecting all transactions.'
    }
  ];
}