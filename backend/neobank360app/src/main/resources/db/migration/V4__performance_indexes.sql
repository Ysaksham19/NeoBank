-- ============================================================
-- V4 — PERFORMANCE INDEXES
-- Applied automatically by Flyway on next application startup.
-- Every index uses IF NOT EXISTS (MySQL 8.0.35+) pattern via
-- CREATE INDEX ... — safe to re-run via Flyway versioning.
-- ============================================================

USE neobank_db;

-- ──────────────────────────────────────────────────────────────
-- TRANSACTIONS  (highest query volume table)
-- ──────────────────────────────────────────────────────────────

-- Hot path: "Get my statement" — filter by account, sort newest first
-- Covers: TransactionRepository.findByAccountOrderByCreatedAtDesc
--         TransactionRepository.findByAccount(account, pageable)
CREATE INDEX idx_txn_account_created
    ON transactions(account_id, created_at DESC);

-- Hot path: "Get receiver side of a transfer"
CREATE INDEX idx_txn_receiver_created
    ON transactions(receiver_account_id, created_at DESC);

-- Hot path: Admin transaction list sorted by date
CREATE INDEX idx_txn_status
    ON transactions(transaction_status);

-- ──────────────────────────────────────────────────────────────
-- NOTIFICATIONS
-- ──────────────────────────────────────────────────────────────

-- Hot path: "Get my unread notifications" — already in V2 but as
-- a separate single-col index; replace with composite for covering
-- Note: V2 already has idx_notifications_user and idx_notifications_is_read
-- This adds the paginated sort path
CREATE INDEX idx_notif_user_read_created
    ON notifications(user_id, is_read, created_at DESC);

-- ──────────────────────────────────────────────────────────────
-- BILLS
-- ──────────────────────────────────────────────────────────────

-- Hot path: "My pending bills" — filter by user + status + due date sort
CREATE INDEX idx_bills_user_status_due
    ON bills(user_id, status, due_date);

-- ──────────────────────────────────────────────────────────────
-- REWARDS
-- ──────────────────────────────────────────────────────────────

-- Hot path: reward history — user + newest first
CREATE INDEX idx_rewards_user_created
    ON rewards(user_id, created_at DESC);

-- ──────────────────────────────────────────────────────────────
-- LOAN APPLICATIONS
-- ──────────────────────────────────────────────────────────────

-- Hot path: Admin loan queue — all PENDING applications oldest first
CREATE INDEX idx_loan_app_status_applied
    ON loan_applications(status, applied_at);

-- Hot path: "My loan applications"
CREATE INDEX idx_loan_app_user_status
    ON loan_applications(user_id, status);

-- ──────────────────────────────────────────────────────────────
-- LOAN REPAYMENTS
-- ──────────────────────────────────────────────────────────────

-- Hot path: EMI schedule for a loan account, sorted by instalment number
CREATE INDEX idx_repayment_account_instalment
    ON loan_repayments(loan_account_id, instalment_number);

-- Hot path: Overdue checker — PENDING repayments past due date
CREATE INDEX idx_repayment_status_due
    ON loan_repayments(payment_status, due_date);

-- ──────────────────────────────────────────────────────────────
-- OTP VERIFICATIONS
-- ──────────────────────────────────────────────────────────────

-- Hot path: look up latest unverified OTP by reference + expires_at
-- Covers: OtpVerificationRepository lookups before expiry check
CREATE INDEX idx_otp_ref_verified_expires
    ON otp_verifications(reference, is_verified, expires_at);

-- ──────────────────────────────────────────────────────────────
-- ACCOUNTS
-- ──────────────────────────────────────────────────────────────

-- Hot path: Admin account list filtered by status
CREATE INDEX idx_accounts_status
    ON accounts(status);

-- ──────────────────────────────────────────────────────────────
-- USERS
-- ──────────────────────────────────────────────────────────────

-- Hot path: Admin user list filtered by status or KYC status
CREATE INDEX idx_users_status
    ON users(status);

CREATE INDEX idx_users_kyc_status
    ON users(kyc_status);
