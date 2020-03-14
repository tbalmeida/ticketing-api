const router = require("express").Router();

module.exports = db => {
  // route to get all the events
  router.get("/events", (request, response) => {
    console.log(request.body);
    db.query(
      `
      SELECT *
      FROM events_vw
     `).then(({ rows: events }) => {
      response.json(events);
    });
  });

  router.get("/events/:id", (request, response) => {
    db.query(
      `
      SELECT *
      FROM events_vw WHERE event_id = $1
     `, [request.params.id]).then(({ rows: events }) => {
      response.json(events);
    });
  });

  // router.patch("/events/:id", (request, response) => {
  //   db.query()
  // })

  // route to delete an event
  // router.delete("/events/:id", (request, response) => {
  //   if (process.env.TEST_ERROR) {
  //     setTimeout(() => response.status(500).json({}), 1000);
  //     return;
  //   }

  //   db.query(`DELETE FROM events WHERE id = $1::integer`, [
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
