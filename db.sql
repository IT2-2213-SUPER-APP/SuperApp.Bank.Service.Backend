CREATE DATABASE BANK;

CREATE TABLE Wallet (
    wallet_id serial primary key,
    wallet_number varchar(19),
    budget numeric(10, 2),
    validity_period varchar(5),
    cvv varchar(3),
    user_id integer,
);

CREATE TABLE User (
    user_id serial primary key,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
);
