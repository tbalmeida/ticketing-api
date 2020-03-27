-- VIEWS
DROP VIEW IF EXISTS events_vw;
DROP VIEW IF EXISTS order_details_vw;

-- TABLES
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS order_status CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS venues CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- FUNCTIONS
DROP FUNCTION IF EXISTS getpercent(INTEGER, INTEGER);
DROP FUNCTION IF EXISTS md5handle(INTEGER);

-- Functions
  -- used to calculate % of capacity used and % of tickets sold
CREATE OR REPLACE FUNCTION getpercent(
	lesser INTEGER,
	total INTEGER)
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
	INTEGER)
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
           CEIL($1 / 32.)::INTEGER) 
       ), 1, $1) );
$BODY$;

-- CREATING TABLES

CREATE TABLE venues (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(300) NOT NULL,
  capacity INTEGER NOT NULL,
  hourly_fee MONEY NOT NULL,
  info_url VARCHAR(100) NULL,
  address VARCHAR(300) NULL,
  city VARCHAR(50) NULL,
  province CHAR(2) NULL,
  address_url VARCHAR(200) NULL
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  duration TIME NOT NULL,
  venue INT REFERENCES venues(id) NOT NULL,
  total_issued INT NOT NULL,
  limit_per_user SMALLINT,
  price MONEY NOT NULL,
  handle VARCHAR(6) DEFAULT 'e' || md5handle(5),
  url_image VARCHAR(300) NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  handle VARCHAR(6) DEFAULT 'u' || md5handle(5)
);

CREATE TABLE order_status (
  id SERIAL PRIMARY KEY NOT NULL,
  status VARCHAR(10) NOT NULL
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  order_date DATE NOT NULL DEFAULT NOW(),
  status INTEGER REFERENCES order_status(id) NOT NULL,
  conf_code VARCHAR(10) DEFAULT 'o' || md5handle(9)
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY NOT NULL,
  order_id INTEGER REFERENCES orders(id) NOT NULL,
  event_id INTEGER REFERENCES events(id) NOT NULL,
  qty SMALLINT NOT NULL,
  conf_code VARCHAR(10) DEFAULT 't' || md5handle(9)
);

CREATE TABLE attendance (
  id SERIAL PRIMARY KEY NOT NULL,
  order_item_id INTEGER REFERENCES order_items(id) NOT NULL,
  date_redeemed TIMESTAMP NOT NULL
);


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
    e.url_image AS event_img,
    v.id AS venue_id,
    v.name AS venue_name,
    v.description AS venue_description,
    v.capacity,
    v.hourly_fee,
    getpercent(e.total_issued, v.capacity) AS percent_capacity,
    e.total_issued * e.price AS max_revenue,
    v.info_url, v.address, v.city, v.province, v.address_url,
    TO_CHAR(e.event_date, 'MON-dd-yyyy') as str_event_date,
    TO_CHAR(e.event_time, 'hh12:MI PM') as str_event_time
   FROM events e
     JOIN venues v ON e.venue = v.id
  ORDER BY e.event_date DESC, v.name;

-- here
DROP FUNCTION IF EXISTS getOrderTotal (INTEGER);

CREATE OR REPLACE FUNCTION getOrderTotal(pID INTEGER)
    RETURNS numeric
    LANGUAGE 'plpgsql'
AS $BODY$
  DECLARE result NUMERIC;
  BEGIN
    SELECT sum(oi.qty * e.price) INTO result
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN events e ON oi.event_id = e.id
    WHERE o.id = pID
    GROUP BY o.id;

  RETURN result;
  END
  $BODY$;

-- 

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
    e.url_image AS event_img,
    oi.qty,
    e.price,
    oi.qty * e.price AS line_total,
    oi.event_id,
    getOrderTotal(o.id) AS order_total,
    TO_CHAR(e.event_date, 'MON-dd-yyyy') as str_event_date,
    TO_CHAR(e.event_time, 'hh12:MI PM') as str_event_time,
    TO_CHAR(o.order_date, 'MON-dd-yyyy') as str_order_date,
    CAST(price AS DECIMAL) AS vl_price,
    os.status
   FROM orders o
     JOIN order_items oi ON o.id = oi.order_id
     JOIN events e ON oi.event_id = e.id
     JOIN users u ON o.user_id = u.id
     JOIN order_status os ON o.status = os.id
  ORDER BY o.order_date DESC, o.id, oi.id;

  -- CRUD functions
DROP FUNCTION IF EXISTS adduser(CHARACTER varying,CHARACTER varying,CHARACTER varying,CHARACTER varying);

CREATE OR REPLACE FUNCTION addUser (
  pFirst_name VARCHAR(30),
  pLast_name VARCHAR(50),
  pEmail VARCHAR(100),
  pPwd VARCHAR(100)
)
  RETURNS VARCHAR(6)
  AS
  $$
    DECLARE userHandle VARCHAR (6);
    BEGIN

    SELECT handle INTO userhandle FROM users WHERE email = pEmail;

    IF NOT FOUND THEN
      INSERT INTO users (first_name, last_name, email, password) VALUES (pFirst_name, pLast_name, pEmail, pPwd)
      RETURNING handle INTO userHandle;
    ELSE
      RAISE WARNING 'This user is already registered: %', pEmail;
    END IF;

    RETURN userHandle;

  END
  $$
  LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS userLogin(CHARACTER varying, CHARACTER varying);

CREATE OR REPLACE FUNCTION userLogin (pEmail VARCHAR(100), pPwd VARCHAR(100))
  RETURNS TABLE(
    id INTEGER,
    first_name VARCHAR(30),
    last_name VARCHAR(50),
    email VARCHAR(100),
    handle VARCHAR(6)
    ) 
AS $$
BEGIN
  RETURN QUERY SELECT u.id, u.first_name, u.last_name, u.email, u.handle
    FROM users u
    WHERE u.email = pEmail AND u.password = pPwd;

  IF NOT FOUND THEN
    RAISE WARNING 'Could not find a user with the provided credentials.';
  END IF;

END;
$$ LANGUAGE plpgsql;