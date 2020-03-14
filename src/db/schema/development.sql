-- Venues
INSERT INTO venues(name, description, capacity, fee) 
  values('Patricia A. Whelan Performance Hall', '3h minimum, $100/hour; Staff & security fee: $60/hour, Combined rental fee: $160/hour', 336, 100)

INSERT INTO venues(name, description, capacity, fee) 
  values('BMO Financial Group Community Room', 'AV control system touch panels, High-quality video ;projectors, Flexible layout options. Accommodates 50–80 people; Integrated sound system', 50, 0);

INSERT INTO venues(name, description, capacity, fee) 
  values('Calgary Central Library room 0-13', 'AV control system touch panels, High-quality video projectors, Flexible layout options. Accommodates 50–80 people; Integrated sound system', 50, 0);

INSERT INTO venues(name, description, capacity, fee) 
  values('Calgary Central Library room 0-14', 'AV control system touch panels, High-quality video projectors, Flexible layout options. Accommodates 50–80 people; Integrated sound system', 50, 0);

ALTER SEQUENCE venues_id_seq RESTART WITH 5;