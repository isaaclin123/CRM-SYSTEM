/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */
drop table if EXISTS Clients;
drop table if EXISTS Users;
 CREATE TABLE Clients(
	id INTEGER NOT NULL PRIMARY KEY,
	first_name varchar not null,
	last_name varchar not null,
	email varchar not null,
	phone_number integer not null,
	city varvhar(20),
	country varchar(20) not null,
	profession varchar not null,
	website varchar,
	facebook varcahr,
	instagram varchar,
	other_social_media varchar,
	notes_on_client varchar
 );
 
 CREATE TABLE Users(
	id INTEGER NOT NULL PRIMARY KEY,
	first_name varchar not null,
	last_name varchar not null,
	username varchar(20) UNIQUE NOT NULL,
	hashPassword varchar(64),
	saltRounds INTEGER NOT NULL,
	authToken varchar(64),
	isAdmin varchar NOT NULL
 );

 
