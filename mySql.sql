CREATE DATABASE neobank_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
use neobank_db;
show tables;

select * from account_types ;
select * from accounts;
select * from branches,kyc_details;
select * from otp_verifications ;
select * from roles;
select * from user_roles;
select * from users;


DROP TABLE users;
USE banking_app;
SHOW TABLES;


CREATE DATABASE banking_app;

SELECT * FROM flyway_schema_history;
SHOW CREATE TABLE flyway_schema_history;


select * from flyway_schema_history;
drop schema neobank_db;
DROP DATABASE banking_app;