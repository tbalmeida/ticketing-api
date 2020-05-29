-- Venues
INSERT INTO venues(name, description, capacity, hourly_fee, address, city, province, address_url, info_url, latitude, longitude) VALUES 
  ('Patricia A. Whelan Performance Hall', '3h minimum, $100/hour; Staff & security fee: $60/hour, Combined rental fee: $160/hour', 336, 100, '800 3 St SE', 'Calgary', 'AB', 'https://goo.gl/maps/cnkkwKsvK6bTxLLLA', 'https://calgarylibrary.ca/events-and-programs/book-a-space/central-library-event-spaces/', 51.0452, -114.0545),
  ('BMO Financial Group Community Room', 'AV control system touch panels, High-quality video ;projectors, Flexible layout options. Accommodates 50–80 people; Integrated sound system', 50, 0, '800 3 St SE', 'Calgary', 'AB', 'https://goo.gl/maps/cnkkwKsvK6bTxLLLA', 'https://calgarylibrary.ca/events-and-programs/book-a-space/central-library-event-spaces/', 51.0452, -114.0545),
  ('Calgary Central Library room 0-13', 'AV control system touch panels, High-quality video projectors, Flexible layout options. Accommodates 50–80 people; Integrated sound system', 50, 0, '800 3 St SE', 'Calgary', 'AB', 'https://goo.gl/maps/cnkkwKsvK6bTxLLLA', 'https://calgarylibrary.ca/events-and-programs/book-a-space/central-library-event-spaces/', 51.0452, -114.0545),
  ('Calgary Central Library room 0-14', 'AV control system touch panels, High-quality video projectors, Flexible layout options. Accommodates 50–80 people; Integrated sound system', 50, 0, '800 3 St SE', 'Calgary', 'AB', 'https://goo.gl/maps/cnkkwKsvK6bTxLLLA', 'https://calgarylibrary.ca/events-and-programs/book-a-space/central-library-event-spaces/', 51.0452, -114.0545),
  ('City of Calgary - Father David Bauer', 'Washrooms, tables, seminar table, chairs, white board, sink/water, overhead projector, cold vending machine & snack vending machine', 20, 0, '2424 University Drive N.W', 'Calgary', 'AB', 'https://goo.gl/maps/vJ6nKdLzpxhUHu2YA', 'https://www.calgary.ca/CSPS/Recreation/Pages/Rentals-and-bookings/Meeting-room-locations.aspx', 51.0738, -114.1258);

ALTER SEQUENCE venues_id_seq RESTART WITH 6;

-- Events
INSERT INTO events (title, description, event_date, event_time, duration, venue, total_issued, limit_per_user, price, url_image) VALUES
('2020 Town Hall', 'First event of the year! We will present the planning for this year, accounts from previous year and share some exciting news. Please, join us.', 
 '2020-09-10', '19:00', '2:00', 1, 330, 10, 15, 'https://www.osrvacation.com/mice/wp-content/uploads/2016/12/conf-hall.png'),

('Employment hunt workshop - Interview skills', 'Fancy getting useful tips about interview skills and Canadian office culture? Join us for this event and sharpen your skill.', 
 '2020-09-18', '10:00', '2:00', 2, 40, 2, 15, 'https://cdn.iconscout.com/icon/premium/png-256-thumb/job-interview-4-486239.png'),

('Employment hunt workshop', 'Looking for a job and need some help rewriting your resume, cover letters and Canadian office culture? Seek no more, join us for a workshop. We provide it every other week.', 
 '2020-10-01', '10:00', '2:00', 4, 40, 2, 15, 'https://ualr.edu/economics/files/2014/01/hire_me_icon_256.png'),

('Employment hunt workshop', 'Looking for a job and need some help rewriting your resume, cover letters and Canadian office culture? Seek no more, join us for a workshop. We provide it every other week.', 
 '2020-10-15', '10:00', '2:00', 4, 40, 2, 15, 'https://cdn.iconscout.com/icon/premium/png-256-thumb/job-interview-4-486239.png'),

('Financial Literacy', 'This event aims to provide some insight about the Canadian Financial Market. Learn about TFSA, RRSP, Stocks and money-related advice. For independency purposes, there will be no products being advertised.', 
 '2020-10-29', '10:00', '2:00', 4, 40, 2, 15, 'https://www.st-clair.net/Data/Sites/29/media/Co-op%20Course/Pictures/Blue%20Pics/dollar.png'),

('Employment hunt workshop - Interview skills', 'Fancy getting useful tips about interview skills and Canadian office culture? Join us for this event and sharpen your skill.', 
 '2020-11-14', '10:00', '2:00', 2, 40, 2, 15, 'https://cdn.iconscout.com/icon/premium/png-256-thumb/job-interview-4-486239.png'),

('Employment hunt workshop', 'Looking for a job and need some help rewriting your resume, cover letters and Canadian office culture? Seek no more, join us for a workshop. We provide it every other week.', 
 '2020-11-28', '10:00', '2:00', 4, 40, 2, 15, 'https://cdn.iconscout.com/icon/premium/png-256-thumb/job-interview-4-486239.png'),

('Social Networking Skills', 'We will talk about social networks can help you land a good job and learn some tips from recruiters?', 
 '2020-12-11', '10:00', '2:00', 4, 40, 2, 15, 'https://socialmedia4us.files.wordpress.com/2012/09/blueprint-social-15.png?w=584');

ALTER SEQUENCE events_id_seq RESTART WITH 9;


-- Users
INSERT INTO users (first_name, last_name, email, password) VALUES
  ('John', 'Doe', 'john@fake.com', '123'),
  ('Jane', 'Doe', 'jane@fake.com', '123'),
  ('Jack', 'Smith', 'jack@fake.com', '123'),
  ('Rick', 'Poe', 'rpoe@fake.com', '123'),
  ('Dianne', 'Black', 'dblack@fake.com', '123');

ALTER SEQUENCE users_id_seq RESTART WITH 6;


-- Order status
INSERT INTO order_status (status) VALUES ('Pending'), ('Complete'), ('Cancelled');

ALTER SEQUENCE order_status_id_seq RESTART WITH 4;


-- Orders
INSERT INTO orders (user_id, order_date, status) VALUES (1, '2020-01-04', 2);
  INSERT INTO order_items (order_id, event_id, qty) VALUES (1, 1, 3);

INSERT INTO orders (user_id, order_date, status) VALUES (3, '2020-01-06', 2);
  INSERT INTO order_items (order_id, event_id, qty) VALUES
   (2, 2, 1),
   (2, 3, 2);

INSERT INTO orders (user_id, order_date, status) VALUES (4, '2020-01-07', 2);
  INSERT INTO order_items (order_id, event_id, qty) VALUES (3, 1, 2);

INSERT INTO orders (user_id, order_date, status) VALUES (5, '2020-01-04', 2);
  INSERT INTO order_items (order_id, event_id, qty) VALUES
   (4, 2, 4),
   (4, 6, 4);

ALTER SEQUENCE orders_id_seq RESTART WITH 5;
ALTER SEQUENCE order_items_id_seq RESTART WITH 7;