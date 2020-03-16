DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS venues CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- VIEWS
DROP VIEW IF EXISTS events_vw;
DROP VIEW IF EXISTS order_details_vw;

-- FUNCTIONS
DROP FUNCTION IF EXISTS getpercent(integer, integer);
DROP FUNCTION IF EXISTS md5handle(integer);

-- Functions
  -- used to calculate % of capacity used and % of tickets sold
CREATE OR REPLACE FUNCTION getpercent(
	lesser integer,
	total integer)
    RETURNS numeric
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE 
AS $BODY$
  DECLARE result NUMERIC;
  BEGIN
  result = ROUND( (lesser::numeric / total) * 100, 2);

  RETURN result;
  END
  $BODY$;

  -- used to create handle for events/users/confirmation
CREATE OR REPLACE FUNCTION md5handle(
	integer)
    RETURNS text
    LANGUAGE 'sql'
    COST 100
    VOLATILE 
AS $BODY$ 
  select upper(
    substring(
      (SELECT string_agg(md5(random()::TEXT), '')
       FROM generate_series(
           1,
           CEIL($1 / 32.)::integer) 
       ), 1, $1) );
$BODY$;




-- CREATING TABLES

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


-- Views
CREATE OR REPLACE VIEW events_vw
 AS
 SELECT e.id AS event_id,
    e.title,
    e.description AS event_description,
    e.event_date,
    e.event_time,
    e.duration,
    e.total_issued,
    e.limit_per_user,
    e.price,
    v.id AS venue_id,
    v.name AS venue_name,
    v.description AS venue_description,
    v.capacity,
    v.fee,
    getpercent(e.total_issued, v.capacity) AS percent_capacity,
    e.total_issued * e.price AS max_revenue
   FROM events e
     JOIN venues v ON e.venue = v.id
  ORDER BY e.event_date DESC, v.name;

CREATE OR REPLACE VIEW order_details_vw
 AS
 SELECT u.first_name,
    u.last_name,
    u.email,
    oi.order_id,
    o.order_date,
    o.conf_code,
    oi.id AS item_id,
    e.title,
    e.description,
    e.event_date,
    e.event_time,
    e.duration,
    oi.qty,
    e.price,
    oi.qty * e.price AS line_total,
    oi.event_id,
    ( SELECT sum(oi2.qty * e2.price) AS sum
           FROM orders o2
             JOIN order_items oi2 ON o2.id = oi2.order_id
             JOIN events e2 ON oi2.event_id = e2.id
          WHERE o2.id = o.id
          GROUP BY o2.id) AS order_total
   FROM orders o
     JOIN order_items oi ON o.id = oi.order_id
     JOIN events e ON oi.event_id = e.id
     JOIN users u ON o.user_id = u.id
  ORDER BY o.order_date DESC, o.id, oi.id;