const router = require("express").Router();
const sendMsg = require( "../../helper/emailHelper");

module.exports = db => {
  // route to get all the events
  router.get("/events", (request, response) => {
    console.log(request.body);
    db.query(`
      SELECT *
      FROM events_vw
     `)
    .then(({ rows: events }) => {
      response.json(events);
    })
    .catch(e => console.error(e.stack));
  });

  // gets info about one event
  router.get("/events/:id", (request, response) => {
    console.log(request.params);
    db.query(`
      SELECT *
      FROM events_vw
      WHERE event_id = $1`, [request.params.id])
    .then(({ rows: events }) => { response.json(events) })
    .catch(e => console.error(e.stack));
  });

  // Updates an event
  router.put("/events/:id", (request, response) => {
    db.query(`
      UPDATE events
      SET title = $2, 
        description = $3,
        event_date = $4,
        event_time = $5,
        duration = $6,
        venue = $7,
        total_issued = $8,
        limit_per_user = $9,
        price = $10
      WHERE id = $1 RETURNING *;
     `, [ request.params.id,
          request.body.title,
          request.body.description,
          request.body.event_date,
          request.body.event_time,
          request.body.duration,
          request.body.venue,
          request.body.total_issued,
          request.body.limit_per_user,
          request.body.price ])
    .then(({ rows: events }) => { response.json(events) })
    .catch(e => console.error(e.stack));
  });

  // Creates a new event
  router.post("/events/new", (request, response) => {
    console.log("here", request.body)
    db.query(`
      INSERT INTO events (title, description, event_date, event_time, duration, venue, total_issued, limit_per_user, price )
        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
      `, [request.body.title,
          request.body.description,
          request.body.event_date,
          request.body.event_time,
          request.body.duration,
          request.body.venue,
          request.body.total_issued,
          request.body.limit_per_user,
          request.body.price ])
    .then(({ rows: events }) => { response.json(events) })
    .catch(e => console.error(e.stack));
  });

  // delete an event
  router.delete("/events/:id", (request, response) => {
    console.log(request.params)
    db.query(`
      DELETE FROM events WHERE id = $1;
      `, [ request.params.id ])
    .then((res) => {
      if (res.rowCount >= 1) {
        response.status(200).json({message: "Event deleted successfully"})
      } else {
        response.status(404).json({message: "Event not found. Please, check if the proper venue was selected."})
      }
    })
    .catch(e => console.error(e.stack));
  });

  return router;
};
