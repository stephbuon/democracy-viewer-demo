# CREATE DATABASE graph_app;

CREATE TABLE users (
    username VARCHAR(20) PRIMARY KEY,
    password VARCHAR(60),
    email VARCHAR(30),
    title VARCHAR(20),
    first_name VARCHAR(20),
    last_name VARCHAR(20),
    suffix VARCHAR(10),
    orcid VARCHAR(16),
    linkedin_link VARCHAR(50)
);

CREATE TABLE private_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE dataset_metadata (
    table_name VARCHAR(50) PRIMARY KEY,
    user VARCHAR(20),
    private_group BIGINT UNSIGNED,
    title VARCHAR(20),
    description VARCHAR(200),
    FOREIGN KEY(user) REFERENCES users(username),
    FOREIGN KEY(private_group) REFERENCES private_groups(id)
);

CREATE TABLE group_members (
    id SERIAL PRIMARY KEY,
    private_group BIGINT UNSIGNED,
    member VARCHAR(20),
    member_rank INT,
    FOREIGN KEY(private_group) REFERENCES private_groups(id),
    FOREIGN KEY(member) REFERENCES users(username)
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    tag_name VARCHAR(15),
    table_name VARCHAR(50),
    FOREIGN KEY(table_name) REFERENCES dataset_metadata(table_name)
);

# Additionally tables will be dynamically generated for uploaded datasets