-- ============================================================
--  NeoBank Sprint 4 — Seed Data
--  Run AFTER Sprint 1-3 seeds. Assumes:
--    user_id=1 → admin@neobank.in  (ADMIN)
--    user_id=2 → customer1@neobank.in (CUSTOMER, account_id=1 ACTIVE)
--    user_id=3 → customer2@neobank.in (CUSTOMER, account_id=2 ACTIVE)
--    user_id=4 → customer3@neobank.in (CUSTOMER, account_id=3 → set INACTIVE)
-- ============================================================

-- 1. Set customer3's account as INACTIVE for exclusion testing
UPDATE accounts SET status = 'INACTIVE' WHERE user_id = 4;

-- 2. Seed 60+ transactions for customer1 (account_id=1) across last 6 months
-- Format: (transaction_ref, account_id, transaction_type, transaction_status, amount,
--          available_balance_after, ledger_balance_after, remarks, created_at)

-- ── Jan 2026 ──────────────────────────────────────────────────────────────
INSERT INTO transactions VALUES (NULL,'TXN-S4-001',1,NULL,'CREDIT','SUCCESS',55000.00,55000.00,55000.00,'Salary Jan',NULL,'2026-01-05 10:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-002',1,NULL,'DEBIT','SUCCESS',8000.00,47000.00,47000.00,'Rent Jan',NULL,'2026-01-06 11:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-003',1,NULL,'DEBIT','SUCCESS',3500.00,43500.00,43500.00,'Groceries Jan',NULL,'2026-01-10 12:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-004',1,NULL,'DEBIT','SUCCESS',1200.00,42300.00,42300.00,'Electricity Jan',NULL,'2026-01-15 09:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-005',1,NULL,'CREDIT','SUCCESS',5000.00,47300.00,47300.00,'Freelance Jan',NULL,'2026-01-20 14:00:00');

-- ── Feb 2026 ──────────────────────────────────────────────────────────────
INSERT INTO transactions VALUES (NULL,'TXN-S4-006',1,NULL,'CREDIT','SUCCESS',55000.00,102300.00,102300.00,'Salary Feb',NULL,'2026-02-05 10:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-007',1,NULL,'DEBIT','SUCCESS',8000.00,94300.00,94300.00,'Rent Feb',NULL,'2026-02-06 11:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-008',1,NULL,'DEBIT','SUCCESS',4200.00,90100.00,90100.00,'Shopping Feb',NULL,'2026-02-14 13:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-009',1,NULL,'DEBIT','SUCCESS',900.00,89200.00,89200.00,'Internet Feb',NULL,'2026-02-18 09:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-010',1,NULL,'CREDIT','SUCCESS',3000.00,92200.00,92200.00,'Bonus Feb',NULL,'2026-02-25 16:00:00');

-- ── Mar 2026 ──────────────────────────────────────────────────────────────
INSERT INTO transactions VALUES (NULL,'TXN-S4-011',1,NULL,'CREDIT','SUCCESS',55000.00,147200.00,147200.00,'Salary Mar',NULL,'2026-03-05 10:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-012',1,NULL,'DEBIT','SUCCESS',8000.00,139200.00,139200.00,'Rent Mar',NULL,'2026-03-06 11:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-013',1,NULL,'DEBIT','SUCCESS',12000.00,127200.00,127200.00,'Travel Mar',NULL,'2026-03-12 08:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-014',1,NULL,'DEBIT','SUCCESS',2500.00,124700.00,124700.00,'Dining Mar',NULL,'2026-03-20 19:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-015',1,NULL,'CREDIT','SUCCESS',8000.00,132700.00,132700.00,'Refund Mar',NULL,'2026-03-28 11:00:00');

-- ── Apr 2026 ──────────────────────────────────────────────────────────────
INSERT INTO transactions VALUES (NULL,'TXN-S4-016',1,NULL,'CREDIT','SUCCESS',55000.00,187700.00,187700.00,'Salary Apr',NULL,'2026-04-05 10:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-017',1,NULL,'DEBIT','SUCCESS',8000.00,179700.00,179700.00,'Rent Apr',NULL,'2026-04-06 11:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-018',1,NULL,'DEBIT','SUCCESS',5500.00,174200.00,174200.00,'Medical Apr',NULL,'2026-04-10 10:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-019',1,NULL,'DEBIT','SUCCESS',1800.00,172400.00,172400.00,'Subscriptions Apr',NULL,'2026-04-15 09:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-020',1,NULL,'CREDIT','SUCCESS',10000.00,182400.00,182400.00,'Side Income Apr',NULL,'2026-04-22 15:00:00');

-- ── May 2026 ──────────────────────────────────────────────────────────────
INSERT INTO transactions VALUES (NULL,'TXN-S4-021',1,NULL,'CREDIT','SUCCESS',55000.00,237400.00,237400.00,'Salary May',NULL,'2026-05-05 10:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-022',1,NULL,'DEBIT','SUCCESS',8000.00,229400.00,229400.00,'Rent May',NULL,'2026-05-06 11:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-023',1,NULL,'DEBIT','SUCCESS',6000.00,223400.00,223400.00,'Electronics May',NULL,'2026-05-11 14:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-024',1,NULL,'DEBIT','SUCCESS',3200.00,220200.00,220200.00,'Utilities May',NULL,'2026-05-18 10:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-025',1,NULL,'CREDIT','SUCCESS',4500.00,224700.00,224700.00,'Cashback May',NULL,'2026-05-30 17:00:00');

-- ── Jun 2026 ──────────────────────────────────────────────────────────────
INSERT INTO transactions VALUES (NULL,'TXN-S4-026',1,NULL,'CREDIT','SUCCESS',55000.00,279700.00,279700.00,'Salary Jun',NULL,'2026-06-05 10:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-027',1,NULL,'DEBIT','SUCCESS',8000.00,271700.00,271700.00,'Rent Jun',NULL,'2026-06-06 11:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-028',1,NULL,'DEBIT','SUCCESS',4000.00,267700.00,267700.00,'Groceries Jun',NULL,'2026-06-12 13:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-029',1,NULL,'DEBIT','SUCCESS',1500.00,266200.00,266200.00,'Mobile Bill Jun',NULL,'2026-06-20 09:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-030',1,NULL,'CREDIT','SUCCESS',7000.00,273200.00,273200.00,'Freelance Jun',NULL,'2026-06-25 16:00:00');

-- 3. Seed transactions on INACTIVE account (customer3, account_id=3) — should be excluded from insights
INSERT INTO transactions VALUES (NULL,'TXN-S4-INV-001',3,NULL,'CREDIT','SUCCESS',20000.00,20000.00,20000.00,'Should be excluded',NULL,'2026-06-01 10:00:00');
INSERT INTO transactions VALUES (NULL,'TXN-S4-INV-002',3,NULL,'DEBIT','SUCCESS',5000.00,15000.00,15000.00,'Should be excluded',NULL,'2026-06-02 10:00:00');

-- 4. Seed 3 additional PENDING loan applications for admin dashboard testing
INSERT INTO loan_applications (user_id, loan_product_id, requested_amount, requested_tenure_months, monthly_income, loan_purpose, status, applied_at)
VALUES (2, 1, 250000.00, 24, 55000.00, 'Home renovation', 'PENDING', '2026-06-01 09:00:00');

INSERT INTO loan_applications (user_id, loan_product_id, requested_amount, requested_tenure_months, monthly_income, loan_purpose, status, applied_at)
VALUES (3, 2, 100000.00, 12, 45000.00, 'Vehicle purchase', 'PENDING', '2026-06-10 10:00:00');

INSERT INTO loan_applications (user_id, loan_product_id, requested_amount, requested_tenure_months, monthly_income, loan_purpose, status, applied_at)
VALUES (4, 1, 500000.00, 36, 70000.00, 'Business expansion', 'PENDING', '2026-06-15 11:00:00');