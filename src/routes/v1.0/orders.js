const router = require("express").Router();
const { sendMsg, textReceipt, htmlReceipt } = require( "../../helper/emailHelper");

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
      // const { amount  } = request.body;
      //database needs to save the purchase info
      // Psst. For production-ready applications we recommend not using the
      // amount directly from the client without verifying it first. This is to
      // prevent bad actors from changing the total amount on the client before
      // it gets sent to the server. A good approach is to send the quantity of
      // a uniquely identifiable product and calculate the total price server-side.
      // Then, you would only fulfill orders using the quantity you charged for.

      // const paymentIntent = await stripe.paymentIntents.create({ amount, currency: "cad" });

      const newOrder = 2;
      // Saves the order in the DB
      db.query(`SELECT * FROM order_details_vw WHERE order_id = $1 ORDER BY order_date DESC, event_date DESC;`, [newOrder])
      .then(({ rows: orders }) => {
        if (orders.length > 0) {

          const textMsg = textReceipt(orders);
          console.log(textMsg);
          const htmlMsg = htmlReceipt(orders);

          // antosha-85@yandex.ru
          sendMsg('tbalmeida@gmail.com', 'Ticketing 4 Good - Your order', textMsg, htmlMsg);
          response.json(orders);
          // response.send(htmlMsg);
        } else {
          response.status(404).json({statusCode: 500, message: 'Order not found'})
        }
      })
      .catch(e => console.error(e.stack));
      // response.status(200).send(paymentIntent.client_secret);
      
    } catch (err) {
      console.log("err", err)
      response.status(500).json({ statusCode: 500, message: err.message });
    }
  });

  return router;
};
