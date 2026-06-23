USE neobank_db;

-- ─────────────────────────────────────────────────────
-- TABLE: loan_products
-- ─────────────────────────────────────────────────────

CREATE TABLE loan_products (
    id                   BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_name         VARCHAR(255)   NOT NULL UNIQUE,
    min_amount           DECIMAL(15,2)  NOT NULL,
    max_amount           DECIMAL(15,2)  NOT NULL,
    annual_interest_rate DECIMAL(5,2)   NOT NULL,
    allowed_tenures      VARCHAR(255)   NOT NULL,
    created_at           TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────
-- SEED: loan_products
-- ─────────────────────────────────────────────────────

INSERT INTO loan_products (product_name, min_amount, max_amount, annual_interest_rate, allowed_tenures) VALUES
('Personal Loan',   10000.00,     500000.00,  12.50, '6,12,18,24,36'),
('Home Loan',       500000.00, 10000000.00,    8.50, '60,84,120,180,240'),
('Car Loan',        100000.00,  2000000.00,    9.75, '12,24,36,48,60'),
('Education Loan',   50000.00,  2000000.00,   10.00, '24,36,48,60,84'),
('Business Loan',   100000.00,  5000000.00,   14.00, '12,24,36,48,60'),
('Gold Loan',        10000.00,   500000.00,    9.00, '3,6,9,12');

-- ─────────────────────────────────────────────────────
-- TABLE: loan_applications
-- ─────────────────────────────────────────────────────

CREATE TABLE loan_applications (
    id                      BIGINT         PRIMARY KEY AUTO_INCREMENT,
    user_id                 BIGINT         NOT NULL,
    loan_product_id         BIGINT         NOT NULL,
    requested_amount        DECIMAL(15,2)  NOT NULL,
    requested_tenure_months INT            NOT NULL,
    monthly_income          DECIMAL(15,2)  NULL,        -- ✅ NEW
    loan_purpose            VARCHAR(255)   NULL,        -- ✅ NEW
    status                  VARCHAR(20)    DEFAULT 'PENDING',
    admin_remarks           VARCHAR(500),
    applied_at              TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    decided_at              TIMESTAMP      NULL,

    CONSTRAINT fk_loan_application_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_loan_application_product
        FOREIGN KEY (loan_product_id)
        REFERENCES loan_products(id)
);

-- ─────────────────────────────────────────────────────
-- TABLE: loan_accounts
-- ─────────────────────────────────────────────────────

CREATE TABLE loan_accounts (
    id                   BIGINT         PRIMARY KEY AUTO_INCREMENT,
    loan_application_id  BIGINT         NOT NULL UNIQUE,
    user_id              BIGINT         NOT NULL,
    principal_amount     DECIMAL(15,2)  NOT NULL,
    outstanding_balance  DECIMAL(15,2)  NOT NULL DEFAULT 0.00,  -- ✅ NEW
    annual_interest_rate DECIMAL(5,2)   NOT NULL,
    tenure_months        INT            NOT NULL,
    emi_amount           DECIMAL(15,2)  NOT NULL,
    status               VARCHAR(20)    NOT NULL DEFAULT 'ACTIVE', -- ✅ NEW
    disbursed_at         TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    closed_at            TIMESTAMP      NULL,                   -- ✅ NEW

    CONSTRAINT fk_loan_account_application
        FOREIGN KEY (loan_application_id)
        REFERENCES loan_applications(id),

    CONSTRAINT fk_loan_account_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────
-- TABLE: loan_repayments
-- ─────────────────────────────────────────────────────

CREATE TABLE loan_repayments (
    id                  BIGINT         PRIMARY KEY AUTO_INCREMENT,
    loan_account_id     BIGINT         NOT NULL,
    instalment_number   INT            NOT NULL,
    due_date            DATE           NOT NULL,
    emi_amount          DECIMAL(15,2)  NOT NULL,
    principal_component DECIMAL(15,2)  NOT NULL,
    interest_component  DECIMAL(15,2)  NOT NULL,
    closing_balance     DECIMAL(15,2)  NULL,                    -- ✅ NEW
    late_fee            DECIMAL(15,2)  NOT NULL DEFAULT 0.00,   -- ✅ NEW
    payment_status      VARCHAR(20)    DEFAULT 'PENDING',
    paid_at             TIMESTAMP      NULL,

    CONSTRAINT fk_loan_repayment_account
        FOREIGN KEY (loan_account_id)
        REFERENCES loan_accounts(id)
        ON DELETE CASCADE
);