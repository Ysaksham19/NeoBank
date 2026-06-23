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

    UNIQUE KEY uq_user_category_month (user_id, category, budget_month),

    CONSTRAINT fk_budget_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

USE neobank_db;

-- ============================================================
-- V4 - NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (

    id          BIGINT        NOT NULL AUTO_INCREMENT,

    user_id     BIGINT        NOT NULL,

    title       VARCHAR(255)  NOT NULL,

    message     TEXT          NOT NULL,

    type        VARCHAR(50)   NOT NULL,

    is_read     BOOLEAN       NOT NULL DEFAULT FALSE,

    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user     ON notifications(user_id);
CREATE INDEX idx_notifications_is_read  ON notifications(user_id, is_read);

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

    id           BIGINT          NOT NULL AUTO_INCREMENT,
    user_id      BIGINT          NOT NULL,
    reward_type  VARCHAR(50)     NOT NULL,
    amount       DECIMAL(15, 2)  NOT NULL,
    description  VARCHAR(500)    NOT NULL,
    created_at   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_reward_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- INDEXES (for query performance)
-- ✅ NO duplicates — defined ONCE here only
-- ✅ NO IF NOT EXISTS — not supported in MySQL 8.0
-- ============================================================

CREATE INDEX idx_rewards_user      ON rewards(user_id);
CREATE INDEX idx_rewards_user_type ON rewards(user_id, reward_type);
CREATE INDEX idx_budgets_user      ON budgets(user_id);
CREATE INDEX idx_budgets_month     ON budgets(budget_month);
CREATE INDEX idx_bills_user        ON bills(user_id);
CREATE INDEX idx_bills_due_date    ON bills(due_date);
CREATE INDEX idx_bills_status      ON bills(status);