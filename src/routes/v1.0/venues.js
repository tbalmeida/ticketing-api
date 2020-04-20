const router = require("express").Router();

module.exports = db => {
  // route to get all the venues
  router.get("/venues", (request, response) => {
    db.query(`
      SELECT id, name, description, capacity, hourly_fee, info_url, address_url, address, city, province, latitude AS lat, longitude AS lng
      FROM venues
      ORDER BY name ASC
     `)
    .then(({ rows: venues }) => {
      response.status(200).json(venues);
    })
    .catch(e => console.error(e.stack));
  });

  // get an especific venue
  router.get("/venues/:id", (request, response) => {
    db.query(`
      SELECT id, name, description, capacity, hourly_fee, info_url, address, city, province, address_url, latitude AS lat, longitude AS lng
      FROM venues
      WHERE id = $1::integer
     `, [request.params.id])
    .then(({ rows: venues }) => {
      response.status(200).json(venues);
    })
    .catch(e => console.error(e.stack));
  });

  // Get events for this venue
  router.get("/venues/:id/events", (request, response) => {
    db.query(`
      SELECT *
      FROM events_vw
      WHERE venue_id = $1::integer
     `, [request.params.id])
    .then(({ rows: events }) => {
      response.status(200).json(events);
    })
    .catch(e => console.error(e.stack));
  });

  // Create a new venue
  router.put("/venues/new", (request, response) => {
    db.query(`
      INSERT INTO venues (name, description, capacity, hourly_fee, info_url, address, city, province, address_url, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
      `, [request.body.name, 
          request.body.description, 
          request.body.capacity, 
          request.body.hourly_fee,
          request.body.info_url,
          request.body.address,
          request.body.city,
          request.body.province,
          request.body.address_url,
          request.body.lat,
          request.body.lng
        ])
    .then(({ rows: venues }) => {
      response.status(201).json(venues);
    })
    .catch(e => console.error(e.stack));
  });

  // Update a venue
  router.patch("/venues/:id", (request, response) => {
    db.query(`
      UPDATE venues 
      SET name = $2, description = $3, capacity = $4, hourly_fee = $5, info_url = $6,
        address = $7, province = $8, address_url = $9
      WHERE id = $1 RETURNING *;
      `, [ request.params.id,
          request.body.name, 
          request.body.description, 
          request.body.capacity, 
          request.body.hourly_fee,
          request.body.info_url,
          request.body.address,
          request.body.city,
          request.body.province,
          request.body.address_url,
          request.body.lat,
          request.body.lng
        ])
    .then(({ rows: venues }) => {
      response.status(200).json(venues);
    })
    .catch(e => console.error(e.stack));
  });

  // delete a venue
  router.delete("/venues/:id", (request, response) => {
    db.query(`
      DELETE FROM venues WHERE id = $1; 
      `, [ request.params.id ])
    .then((res) => {
      if (res.rowCount >= 1) {
        response.status(200).json({message: "Venue deleted successfully"})
      } else {
        response.status(404).json({message: "Venue not found. Please, check if the proper venue was selected."})
      }
    })
    .catch(e => console.error(e.stack));
  });

  return router;
};
