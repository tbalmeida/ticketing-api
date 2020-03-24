-- Venues
INSERT INTO venues(name, description, capacity, hourly_fee, address, city, province, address_url, info_url) 
  VALUES('Patricia A. Whelan Performance Hall', '3h minimum, $100/hour; Staff & security fee: $60/hour, Combined rental fee: $160/hour', 336, 100, '800 3 St SE', 'Calgary', 'AB', 'https://goo.gl/maps/cnkkwKsvK6bTxLLLA', 'https://calgarylibrary.ca/events-and-programs/book-a-space/central-library-event-spaces/');

INSERT INTO venues(name, description, capacity, hourly_fee, address, city, province, address_url, info_url) 
  VALUES('BMO Financial Group Community Room', 'AV control system touch panels, High-quality video ;projectors, Flexible layout options. Accommodates 50–80 people; Integrated sound system', 50, 0, '800 3 St SE', 'Calgary', 'AB', 'https://goo.gl/maps/cnkkwKsvK6bTxLLLA', 'https://calgarylibrary.ca/events-and-programs/book-a-space/central-library-event-spaces/');

INSERT INTO venues(name, description, capacity, hourly_fee, address, city, province, address_url, info_url) 
  VALUES('Calgary Central Library room 0-13', 'AV control system touch panels, High-quality video projectors, Flexible layout options. Accommodates 50–80 people; Integrated sound system', 50, 0, '800 3 St SE', 'Calgary', 'AB', 'https://goo.gl/maps/cnkkwKsvK6bTxLLLA', 'https://calgarylibrary.ca/events-and-programs/book-a-space/central-library-event-spaces/');

INSERT INTO venues(name, description, capacity, hourly_fee, address, city, province, address_url, info_url) 
  VALUES('Calgary Central Library room 0-14', 'AV control system touch panels, High-quality video projectors, Flexible layout options. Accommodates 50–80 people; Integrated sound system', 50, 0, '800 3 St SE', 'Calgary', 'AB', 'https://goo.gl/maps/cnkkwKsvK6bTxLLLA', 'https://calgarylibrary.ca/events-and-programs/book-a-space/central-library-event-spaces/');

INSERT INTO venues(name, description, capacity, hourly_fee, address, city, province, address_url, info_url) 
  VALUES('City of Calgary - Father David Bauer', 'Washrooms, tables, seminar table, chairs, white board, sink/water, overhead projector, cold vending machine & snack vending machine', 20, 0, '2424 University Drive N.W', 'Calgary', 'AB', 'https://goo.gl/maps/vJ6nKdLzpxhUHu2YA', 'https://www.calgary.ca/CSPS/Recreation/Pages/Rentals-and-bookings/Meeting-room-locations.aspx');

ALTER SEQUENCE venues_id_seq RESTART WITH 6;


-- Events
INSERT INTO events (title, description, event_date, event_time, duration, venue, total_issued, limit_per_user, price)
 VALUES ('2020 Town Hall', 'First event of the year! We will present the planning for this year, accounts from previous year and share some exciting news. Please, join us.', 
 '2020-01-10', '19:00', '2:00', 1, 330, 10, 15);

INSERT INTO events (title, description, event_date, event_time, duration, venue, total_issued, limit_per_user, price)
 VALUES ('2020 Employment hunt workshop', 'Looking for a job and need some help rewriting your resume, cover letters and Canadian office culture? Seek no more, join us for a workshop. We provide it every other week.', 
 '2020-01-18', '10:00', '2:00', 2, 40, 2, 15);

INSERT INTO events (title, description, event_date, event_time, duration, venue, total_issued, limit_per_user, price)
 VALUES ('Feb 1st - Employment hunt workshop', 'Looking for a job and need some help rewriting your resume, cover letters and Canadian office culture? Seek no more, join us for a workshop. We provide it every other week.', 
 '2020-02-01', '10:00', '2:00', 4, 40, 2, 15);

INSERT INTO events (title, description, event_date, event_time, duration, venue, total_issued, limit_per_user, price)
 VALUES ('Feb 15 - Employment hunt workshop', 'Looking for a job and need some help rewriting your resume, cover letters and Canadian office culture? Seek no more, join us for a workshop. We provide it every other week.', 
 '2020-02-15', '10:00', '2:00', 4, 40, 2, 15);

ALTER SEQUENCE events_id_seq RESTART WITH 5;


-- Users
INSERT INTO users (first_name, last_name, email, password) VALUES ('John', 'Doe', 'john@fake.com', '123');
INSERT INTO users (first_name, last_name, email, password) VALUES ('Jane', 'Doe', 'jane@fake.com', '123');
INSERT INTO users (first_name, last_name, email, password) VALUES ('Jack', 'Smith', 'jack@fake.com', '123');

ALTER SEQUENCE users_id_seq RESTART WITH 4;

-- Orders
INSERT INTO orders (user_id, order_date) VALUES (1, '2020-01-04');
  INSERT INTO order_items (order_id, event_id, qty) VALUES (1, 1, 3);

INSERT INTO orders (user_id, order_date) VALUES (3, '2020-01-06');
  INSERT INTO order_items (order_id, event_id, qty) VALUES (2, 2, 1);
  INSERT INTO order_items (order_id, event_id, qty) VALUES (2, 3, 2);

ALTER SEQUENCE orders_id_seq RESTART WITH 3;
ALTER SEQUENCE users_id_seq RESTART WITH 4;