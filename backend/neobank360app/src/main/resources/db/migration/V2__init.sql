USE neobank_db;

USE neobank_db;

-- ============================================================
-- V2 - BUDGETS, BILLS, REWARDS
-- ============================================================


-- ============================================================
-- 1. BUDGETS
-- ============================================================

CREATE TABLE IF NOT EXISTS budgets (

    id           BIGINT         NOT NULL AUTO_INCREMENT,

    user_id      BIGINT         NOT NULL,

    category     VARCHAR(50)    NOT NULL,

    budget_month DATE           NOT NULL,

    limit_amount DECIMAL(15, 2) NOT NULL,

    created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    -- ✅ REQUIRED: matches @UniqueConstraint in Budget.java entity
    UNIQUE KEY uq_user_category_month (user_id, category, budget_month),

    CONSTRAINT fk_budget_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE

);


-- ============================================================
-- 2. BILLS
-- ============================================================

CREATE TABLE IF NOT EXISTS bills (

    id           BIGINT         NOT NULL AUTO_INCREMENT,

    user_id      BIGINT         NOT NULL,

    biller_name  VARCHAR(255)   NOT NULL,

    category     VARCHAR(100),

    amount       DECIMAL(15, 2) NOT NULL,

    due_date     DATE           NOT NULL,

    -- ✅ FIXED: CHECK constraint ensures only valid status values
    status       VARCHAR(20)    NOT NULL DEFAULT 'PENDING',

    created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_bill_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_bill_status
        CHECK (status IN ('PENDING', 'PAID', 'OVERDUE'))

);


-- ============================================================
-- 3. REWARDS
-- ============================================================

CREATE TABLE IF NOT EXISTS rewards (

    id             BIGINT     NOT NULL AUTO_INCREMENT,

    user_id        BIGINT     NOT NULL,

    points_balance INT        NOT NULL DEFAULT 0,

    -- ✅ FIXED: ON UPDATE so timestamp refreshes when points change
    last_updated   TIMESTAMP  DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    -- One rewards record per user
    UNIQUE KEY uq_rewards_user (user_id),

    CONSTRAINT fk_reward_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE

);


-- ============================================================
-- INDEXES  (for query performance)
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_budgets_user
    ON budgets(user_id);

CREATE INDEX IF NOT EXISTS idx_budgets_month
    ON budgets(budget_month);

CREATE INDEX IF NOT EXISTS idx_bills_user
    ON bills(user_id);

CREATE INDEX IF NOT EXISTS idx_bills_due_date
    ON bills(due_date);

CREATE INDEX IF NOT EXISTS idx_bills_status
    ON bills(status);