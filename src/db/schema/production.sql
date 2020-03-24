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