CREATE DATABASE todo_item;

CREATE TYPE mood AS ENUM ('NotStarted', 'OnGoing', 'Completed');
CREATE TABLE Todo (
  id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  status mood NOT NULL,
  PRIMARY KEY (id, user_id),
  FOREIGN KEY (user_id)
      REFERENCES User_IN (user_id)
);

CREATE TABLE User_IN (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
