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

CREATE TABLE rewards (

    id           BIGINT          NOT NULL AUTO_INCREMENT,

    user_id      BIGINT          NOT NULL,

    reward_type  VARCHAR(50)     NOT NULL,

    amount       DECIMAL(15, 2)  NOT NULL,

    description  VARCHAR(500)    NOT NULL,

    created_at   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    -- NO unique constraint on user_id — one user can have many reward rows
    CONSTRAINT fk_reward_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE

);

-- Step 3: Index for fast lookup by user
CREATE INDEX idx_rewards_user ON rewards(user_id);

-- Step 4: Index for lookup by user + reward_type (used by upsert in RewardService)
CREATE INDEX idx_rewards_user_type ON rewards(user_id, reward_type);

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