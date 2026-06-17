USE neobank_db;

CREATE TABLE budgets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    category VARCHAR(50) NOT NULL,

    budget_month DATE NOT NULL,

    limit_amount DECIMAL(15,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_budget_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE bills (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    biller_name VARCHAR(255) NOT NULL,

    category VARCHAR(100),

    amount DECIMAL(15,2) NOT NULL,

    due_date DATE NOT NULL,

    status VARCHAR(20) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bill_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE rewards (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT UNIQUE NOT NULL,

    points_balance INT DEFAULT 0,

    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reward_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);