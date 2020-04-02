const router = require("express").Router();
const paymentIntent = require('./payment_intent');
const ENV = require("../../environment");

module.exports = db => {

  // process payment and saves the order on the DB
  router.post("/orders/new", paymentIntent);

  // route to get all the orders. Should be protected, only on Dev/Test
  if (ENV === "development") {
    router.get("/orders", (request, response) => {
      db.query(`SELECT * FROM order_details_vw`)
      .then(({ rows: orders }) => {response.status(200).json(orders)})
      .catch(e => console.error(e.stack));
    });
  }

  // shows a specific order
  router.get("/orders/:id", (request, response) => {
    db.query(`SELECT * FROM order_details_vw WHERE conf_code = $1`, [ request.params.id ])
    .then(({ rows: orders }) => {response.status(200).json(orders)})
    .catch(e => console.error(e.stack));
  });

  return router;
};
