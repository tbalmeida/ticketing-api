DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS venues CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE venues (
  id serial PRIMARY KEY NOT NULL,
  name varchar(100) NOT NULL,
  description varchar(300),
  capacity integer NOT NULL,
  fee money NOT NULL
);

CREATE TABLE events (
  id serial PRIMARY KEY NOT NULL,
  title varchar(100) UNIQUE NOT NULL,
  description varchar(500) NOT NULL,
  event_date date NOT NULL,
  event_time time NOT NULL,
  duration time NOT NULL,
  venue int REFERENCES venues(id) NOT NULL,
  total_issued int NOT NULL,
  limit_per_user smallint,
  price money NOT NULL
);

CREATE TABLE users (
  id serial PRIMARY KEY NOT NULL,
  first_name varchar(30) NOT NULL,
  last_name varchar(50) NOT NULL,
  email varchar(100) UNIQUE NOT NULL,
  password varchar(100) NOT NULL,
  handle varchar(10) DEFAULT 'U' || md5handle(9)
);

CREATE TABLE orders (
  id serial PRIMARY KEY NOT NULL,
  user_id integer REFERENCES users(id) NOT NULL,
  order_date date NOT NULL,
  conf_code varchar(30) NOT NULL
);

CREATE TABLE order_items (
  id serial NOT NULL,
  order_id integer REFERENCES orders(id) NOT NULL,
  event_id integer NOT NULL,
  qty smallint NOT NULL,
  conf_code varchar(30) DEFAULT 'T' || md5handle(29)
);

ALTER TABLE events ADD FOREIGN KEY (venue) REFERENCES venues (id);

ALTER TABLE orders ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE order_items ADD FOREIGN KEY (order_id) REFERENCES orders (id);

ALTER TABLE order_items ADD FOREIGN KEY (id) REFERENCES events (id);
