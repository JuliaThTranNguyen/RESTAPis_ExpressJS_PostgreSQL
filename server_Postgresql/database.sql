CREATE DATABASE todo_item;

CREATE TABLE todo(
    todo_id INT NOT NULL,
    user_id INT NOT NULL,
    name VARCHAR(65) UNIQUE NOT NULL,
    description VARCHAR(255),
    update_status TIMESTAMP NOT NULL,
    created_status TIMESTAMP NOT NULL,
    login_status TIMESTAMP,
    PRIMARY KEY(todo_id, user_id)
);