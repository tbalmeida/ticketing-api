const router = require("express").Router();
const sendMsg = require( "../../helper/emailHelper");

module.exports = db => {
  // route to get all the orders. Should be protected, only for system
  router.get("/orders", (request, response) => {
    db.query(`SELECT * FROM orders_vw`)
    .then(({ rows: orders }) => {response.status(200).json(orders)})
    .catch(e => console.error(e.stack));
  });

  router.get("/orders/:id", (request, response) => {
    db.query(`SELECT * FROM order_details_vw WHERE conf_code = $1`, [ request.params.id ])
    .then(({ rows: orders }) => {response.status(200).json(orders)})
    .catch(e => console.error(e.stack));
  });


  router.put("/orders/new", (request, response) => {
    try {
    const { amount  } = request.body;
      //database needs to save the purchase info
      // Psst. For production-ready applications we recommend not using the
      // amount directly from the client without verifying it first. This is to
      // prevent bad actors from changing the total amount on the client before
      // it gets sent to the server. A good approach is to send the quantity of
      // a uniquely identifiable product and calculate the total price server-side.
      // Then, you would only fulfill orders using the quantity you charged for.

      const paymentIntent = await stripe.paymentIntents.create({ amount, currency: "cad" });

      response.status(200).send(paymentIntent.client_secret);
    } catch (err) {
      console.log("err", err)
      response.status(500).json({ statusCode: 500, message: err.message });
    }
  });

  return router;
};
