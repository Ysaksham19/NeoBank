USE neobank_db;

CREATE TABLE loan_products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    product_name VARCHAR(255) NOT NULL UNIQUE,

    min_amount DECIMAL(15,2) NOT NULL,

    max_amount DECIMAL(15,2) NOT NULL,

    annual_interest_rate DECIMAL(5,2) NOT NULL,

    allowed_tenures VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE loan_applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    loan_product_id BIGINT NOT NULL,

    requested_amount DECIMAL(15,2) NOT NULL,

    requested_tenure_months INT NOT NULL,

    status VARCHAR(20) DEFAULT 'PENDING',

    admin_remarks VARCHAR(500),

    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    decided_at TIMESTAMP NULL,

    CONSTRAINT fk_loan_application_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_loan_application_product
        FOREIGN KEY (loan_product_id)
        REFERENCES loan_products(id)
);

CREATE TABLE loan_accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    loan_application_id BIGINT NOT NULL UNIQUE,

    user_id BIGINT NOT NULL,

    principal_amount DECIMAL(15,2) NOT NULL,

    annual_interest_rate DECIMAL(5,2) NOT NULL,

    tenure_months INT NOT NULL,

    emi_amount DECIMAL(15,2) NOT NULL,

    disbursed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_loan_account_application
        FOREIGN KEY (loan_application_id)
        REFERENCES loan_applications(id),

    CONSTRAINT fk_loan_account_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE loan_repayments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    loan_account_id BIGINT NOT NULL,

    instalment_number INT NOT NULL,

    due_date DATE NOT NULL,

    emi_amount DECIMAL(15,2) NOT NULL,

    principal_component DECIMAL(15,2) NOT NULL,

    interest_component DECIMAL(15,2) NOT NULL,

    payment_status VARCHAR(20) DEFAULT 'PENDING',

    paid_at TIMESTAMP NULL,

    CONSTRAINT fk_loan_repayment_account
        FOREIGN KEY (loan_account_id)
        REFERENCES loan_accounts(id)
        ON DELETE CASCADE
);