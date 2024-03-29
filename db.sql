/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */
 drop TABLE if EXISTS Company;
 drop TABLE if EXISTS TaskForUser;
 drop TABLE if EXISTS ClientBelongTo;
 drop TABLE if EXISTS TaskForClient;
drop table if EXISTS Clients;
drop table if EXISTS Users;

 CREATE TABLE Company(
	id bigserial not null PRIMARY key,
	company_name varchar unique not null
 );

 CREATE TABLE Users(
	id bigserial not null PRIMARY KEY,
	first_name varchar not null,
	last_name varchar not null,
	username varchar(20) UNIQUE NOT NULL,
	hashPassword varchar(64),
	saltRounds INTEGER NOT NULL,
	authToken varchar(64),
	isSuperAdmin varchar NOT NULL,
	isQualifiedCompany varchar NOT NULL,
	jobTitle varchar not null,
	email varchar not null
 );
 
 CREATE TABLE Clients(
	id bigserial NOT NULL PRIMARY KEY,
	first_name varchar not null,
	last_name varchar not null,
	email varchar not null,
	phone_number varchar not null,
	city varchar(20),
	country varchar(20) not null,
	profession varchar not null,
	website varchar,
	social_media varchar,
	notes_on_client varchar,
	meet_with varchar,
	tag varchar,
	belong_company varchar NOT null,
	progress_status varchar,
	FOREIGN KEY (belong_company) REFERENCES Company (company_name)
 );
 
 CREATE table ClientBelongTo(
	id bigserial NOT NULL PRIMARY KEY,
	clientID INTEGER NOT NULL,
	company_name varchar NOT null,
	FOREIGN key (clientID) REFERENCES Clients(id),
	FOREIGN key (company_name) REFERENCES Users(isQualifiedCompany)
	
 );

 CREATE TABLE TaskForClient(
	id bigserial NOT NULL PRIMARY KEY,
	task_name varchar not null,
	task_description varchar not null,
	clientID INTEGER not null,
	userID INTEGER not null,
	task_start_date varchar not null,
	task_end_date varchar not null,
	isCompleted varchar
 );
 

 

 


 
