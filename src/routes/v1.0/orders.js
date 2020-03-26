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
      // console.log(request.body);
      let userID = 0;
      let sqlOrderItems = ``;
      let orderID = 0;
      db.query(`SELECT id FROM users WHERE handle = $1;`, [request.body.handle] )
        .then(({rows: user}) => {
          if (user.length === 1) {
            userID = user[0].id;
            // Creates the order and add items to it

            db.query(`INSERT INTO orders (user_id, order_date) VALUES ( ${userID}, now()) RETURNING *;`)
            .then(({rows: order}) => {
              orderID = order[0].id;
              console.log("order: ", orderID);

              const thisCart = request.body.cartItems;
              
              thisCart.forEach(item => {
                let { id, quantity, price } = item;
                sqlOrderItems += sqlOrderItems.length > 0 ? `, ` : ``;
                sqlOrderItems += `( ${orderID}, ${id}, ${quantity})`
                console.log(id, quantity, price, quantity * price);
              });
              sqlOrderItems = `INSERT INTO order_items (order_id, event_id, qty) VALUES ` + sqlOrderItems + `;`
              console.log("Items: ", sqlOrderItems);

              db.query(sqlOrderItems)
              .then(() => {
                console.log("Gravou tudo!");
              })
              .catch( e => console.error(e.stack));
            })
            .catch( e => console.error(e.stack));


          } else {
            response.status(404).json({statusCode: 500, message: 'User not found'});
          }
        })
        .finally(() => response.status(201).json({message: 'Ok'}))
        .catch( e => console.error(e.stack));
      // const { amount  } = request.body;
      //database needs to save the purchase info
      // Psst. For production-ready applications we recommend not using the
      // amount directly from the client without verifying it first. This is to
      // prevent bad actors from changing the total amount on the client before
      // it gets sent to the server. A good approach is to send the quantity of
      // a uniquely identifiable product and calculate the total price server-side.
      // Then, you would only fulfill orders using the quantity you charged for.

      // const paymentIntent = await stripe.paymentIntents.create({ amount, currency: "cad" });

      if (1 == 4 ) {
      const newOrder = 2;
      // Saves the order in the DB
      db.query(`SELECT * FROM order_details_vw WHERE order_id = $1 ORDER BY order_date DESC, event_date DESC;`, [newOrder])
      .then(({ rows: orders }) => {
        if (orders.length > 0) {

          const textMsg = textReceipt(orders);
          console.log(textMsg);
          const htmlMsg = htmlReceipt(orders);

          // sendMsg('tbalmeida@gmail.com', 'Ticketing 4 Good - Your order', textMsg, htmlMsg);
          response.json(orders);
        } else {
          response.status(404).json({statusCode: 500, message: 'Order not found'})
        }
      })
      .catch(e => console.error(e.stack));
      // response.status(200).send(paymentIntent.client_secret);
    }
    } catch (err) {
      console.log("err", err)
      response.status(500).json({ statusCode: 500, message: err.message });
    }
  });

  return router;
};
