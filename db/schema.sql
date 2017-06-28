DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS comments CASCADE;


CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_digest VARCHAR(255)
);


CREATE TABLE posts (
id SERIAL PRIMARY KEY,
country VARCHAR(255) NOT NULL,
url_image VARCHAR (255) NOT NULL,
comment VARCHAR(5000) NOT NULL,
user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  comment VARCHAR(1000),
  post_id INTEGER REFERENCES posts(id) ON UPDATE CASCADE
);


