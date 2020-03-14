const router = require("express").Router();

module.exports = db => {
  // route to get all the venues
  router.get("/venues", (request, response) => {
    db.query(
      `
      SELECT id, name, description, capacity, fee
      FROM venues
      ORDER BY name ASC
     `).then(({ rows: venues }) => {
      response.json(venues);
    });
  });

  // get an especific venue
  router.get("/venues/:id", (request, response) => {
    db.query(`
      SELECT id, name, description, capacity, fee
      FROM venues
      WHERE id = $1::integer
     `, [request.params.id]).then(({ rows: venues }) => {
      response.json(venues);
    });
  });

  // Get events for this venue
  router.get("/venues/:id/events", (request, response) => {
    db.query(`
      SELECT *
      FROM events_vw
      WHERE venue_id = $1::integer
     `, [request.params.id]).then(({ rows: events }) => {
      response.json(events);
    });
  });

  // route to delete a venue.
  // router.delete("/venues/:id", (request, response) => {
  //   if (process.env.TEST_ERROR) {
  //     setTimeout(() => response.status(500).json({}), 1000);
  //     return;
  //   }

  //   db.query(`DELETE FROM venues WHERE id = $1::integer`, [
  //     request.params.id
  //   ]).then(() => {
  //     setTimeout(() => {
  //       response.status(204).json({});
  //       updateAppointment(Number(request.params.id), null);
  //     }, 1000);
  //   });
  // });

  return router;
};
