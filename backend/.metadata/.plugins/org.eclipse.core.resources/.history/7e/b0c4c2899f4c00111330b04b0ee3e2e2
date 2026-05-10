-- ============================================================
-- NEO BANK - Initial Schema Migration (underscore naming)
-- ============================================================

-- 1. ROLES
CREATE TABLE IF NOT EXISTS roles (
    id   BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_roles_name (name)
);

-- 2. USERS
CREATE TABLE IF NOT EXISTS users (
    id            BIGINT NOT NULL AUTO_INCREMENT,
    customer_no   VARCHAR(10) NOT NULL,
    full_name     VARCHAR(120) NOT NULL,
    email         VARCHAR(120) NOT NULL,
    phone         VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    status        VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    kyc_status    VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_customer_no (customer_no),
    UNIQUE KEY uk_users_email (email),
    UNIQUE KEY uk_users_phone (phone)
);

-- 3. USER_ROLES
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_userroles_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_userroles_role FOREIGN KEY (role_id) REFERENCES roles (id)
);

-- 4. BRANCHES
CREATE TABLE IF NOT EXISTS branches (
    id          BIGINT NOT NULL AUTO_INCREMENT,
    branch_code VARCHAR(20) NOT NULL,
    branch_name VARCHAR(120) NOT NULL,
    city        VARCHAR(80) NOT NULL,
    state       VARCHAR(80) NOT NULL,
    address     VARCHAR(255),
    ifsc_code   VARCHAR(20) NOT NULL,
    status      VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_branch_code (branch_code),
    UNIQUE KEY uk_ifsc_code (ifsc_code)
);

-- 5. ACCOUNTS
CREATE TABLE IF NOT EXISTS accounts (
    id                BIGINT NOT NULL AUTO_INCREMENT,
    account_no        VARCHAR(20) NOT NULL,
    user_id           BIGINT NOT NULL,
    branch_id         BIGINT,
    account_type      VARCHAR(30) NOT NULL,
    currency          VARCHAR(10) NOT NULL DEFAULT 'INR',
    available_balance DECIMAL(19,2) NOT NULL DEFAULT 0.00,
    ledger_balance    DECIMAL(19,2) NOT NULL DEFAULT 0.00,
    status            VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_account_no (account_no),
    CONSTRAINT fk_accounts_user   FOREIGN KEY (user_id)   REFERENCES users (id),
    CONSTRAINT fk_accounts_branch FOREIGN KEY (branch_id) REFERENCES branches (id)
);

-- 6. KYC DETAILS
CREATE TABLE IF NOT EXISTS kyc_details (
    id               BIGINT NOT NULL AUTO_INCREMENT,
    user_id          BIGINT NOT NULL,
    aadhaar_number   VARCHAR(20) NOT NULL,
    pan_number       VARCHAR(20) NOT NULL,
    aadhaar_verified TINYINT(1) NOT NULL DEFAULT 0,
    pan_verified     TINYINT(1) NOT NULL DEFAULT 0,
    kyc_status       VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_kyc_aadhaar (aadhaar_number),
    UNIQUE KEY uk_kyc_pan (pan_number),
    CONSTRAINT fk_kyc_user FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 7. OTP VERIFICATIONS
CREATE TABLE IF NOT EXISTS otp_verifications (
    id          BIGINT NOT NULL AUTO_INCREMENT,
    reference   VARCHAR(120) NOT NULL,
    otp_type    VARCHAR(30) NOT NULL,
    otp_code    VARCHAR(10) NOT NULL,
    is_verified TINYINT(1) NOT NULL DEFAULT 0,
    expires_at  TIMESTAMP NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_otp_reference (reference),
    KEY idx_otp_type (otp_type)
);

-- 8. ACCOUNT TYPES
CREATE TABLE IF NOT EXISTS account_types (
    id              BIGINT NOT NULL AUTO_INCREMENT,
    type_code       VARCHAR(30) NOT NULL,
    type_name       VARCHAR(60) NOT NULL,
    minimum_balance DECIMAL(19,2) NOT NULL DEFAULT 0.00,
    description     VARCHAR(255),
    status          VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    PRIMARY KEY (id),
    UNIQUE KEY uk_type_code (type_code)
);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO roles (name) VALUES ('ROLE_USER')  ON DUPLICATE KEY UPDATE name = name;
INSERT INTO roles (name) VALUES ('ROLE_ADMIN') ON DUPLICATE KEY UPDATE name = name;

INSERT INTO account_types (type_code, type_name, minimum_balance, description) VALUES
('SAVINGS', 'Savings Account', 1000.00, 'Minimum balance ₹1,000 required'),
('CURRENT', 'Current Account', 5000.00, 'Minimum balance ₹5,000 required'),
('SALARY',  'Salary Account',  0.00,    'Zero balance salary account')
ON DUPLICATE KEY UPDATE type_name = type_name;

INSERT INTO branches (branch_code, branch_name, city, state, address, ifsc_code) VALUES
('MUM001', 'Mumbai Main Branch',        'Mumbai',      'Maharashtra', 'Fort, Mumbai - 400001',              'NEO0MUM001'),
('DEL001', 'Delhi Connaught Branch',    'New Delhi',   'Delhi',       'Connaught Place, Delhi - 110001',    'NEO0DEL001'),
('BLR001', 'Bangalore MG Road',         'Bangalore',   'Karnataka',   'MG Road, Bangalore - 560001',        'NEO0BLR001'),
('CHN001', 'Chennai Anna Salai',        'Chennai',     'Tamil Nadu',  'Anna Salai, Chennai - 600002',       'NEO0CHN001'),
('HYD001', 'Hyderabad Hitech City',     'Hyderabad',   'Telangana',   'Hitech City, Hyd - 500081',          'NEO0HYD001'),
('KOL001', 'Kolkata Park Street',       'Kolkata',     'West Bengal', 'Park Street, Kolkata - 700016',      'NEO0KOL001'),
('PUN001', 'Pune FC Road',              'Pune',        'Maharashtra', 'FC Road, Pune - 411004',             'NEO0PUN001'),
('BHU001', 'Bhubaneswar Janpath',       'Bhubaneswar', 'Odisha',      'Janpath, BBSR - 751001',             'NEO0BHU001')
ON DUPLICATE KEY UPDATE branch_name = branch_name;