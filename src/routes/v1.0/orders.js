const router = require("express").Router();
const { sendMsg, textReceipt, htmlReceipt } = require( "../../helper/emailHelper");
const { processPayment } = require("../../helper/checkout");


module.exports = db => {
  // route to get all the orders. Should be protected, only for system
  router.get("/orders", (request, response) => {
    db.query(`SELECT * FROM orders_vw`)
    .then(({ rows: orders }) => {response.status(200).json(orders)})
    .catch(e => console.error(e.stack));
  });

  // shows a specific order
  router.get("/orders/:id", (request, response) => {
    db.query(`SELECT * FROM order_details_vw WHERE conf_code = $1`, [ request.params.id ])
    .then(({ rows: orders }) => {response.status(200).json(orders)})
    .catch(e => console.error(e.stack));
  });

  
  // creates a new order
  router.put("/orders/new/", (request, response) => {
    try {
      let userID = 0;
      let sqlOrderItems = ``;
      let orderID = 0;
      let total = 0;
      
              // charges using Stripe
              // const paymentIntent = await stripe.paymentIntents.create({ req.body.amount, currency: "cad" });
      // retrieves the user ID
      db.query(`SELECT id FROM users WHERE handle = $1;`, [request.body.handle] )
      .then(({rows: user}) => {
        if (user.length === 1) {
          userID = user[0].id;
          console.log(`User: ${userID}`);

          // Creates a pending order
          db.query(`INSERT INTO orders (user_id, order_date, status) VALUES ( ${userID}, now(), 1) RETURNING *;`)
          .then(({rows: order}) => {
            orderID = order[0].id;

            // creates the insert lines for the cart
            const thisCart = request.body.cartItems;
            thisCart.forEach(item => {
              let { id, quantity, price } = item;
              sqlOrderItems += sqlOrderItems.length > 0 ? `, ` : ``;
              sqlOrderItems += `( ${orderID}, ${id}, ${quantity})`
              total += quantity * price;
            });
            
            console.log(`  - Total: ${total}`);
            
            sqlOrderItems = `INSERT INTO order_items (order_id, event_id, qty) VALUES ` + sqlOrderItems + `;`
            db.query(sqlOrderItems)
            // .then(() => {
            //   console.log("  - Order saved. Charging Stripe...");
              // charges using Stripe
              // const paymentIntent = await stripe.paymentIntents.create({ req.body.amount, currency: "cad" });
            // })
            .catch( e => console.error(e.stack));
          })
          .catch( e => console.error(e.stack));

                    // charges using Stripe
          // const paymentIntent = await stripe.paymentIntents.create({ req.body.amount, currency: "cad" });

        } else {
          response.status(500).json({statusCode: 500, message: 'User not found'});
        }
      })
      .finally(() => response.status(201).json({message: 'Ok'}))
      .catch( (err) => {
        console.log("err", err.message)
        response.status(500).json({ statusCode: 500, message: err.message })
      });

      //   db.query(`SELECT * FROM order_details_vw WHERE order_id = $1 ORDER BY order_date DESC, event_date DESC;`, [orderID])
      //   .then(({ rows: orders }) => {
      //     const textMsg = textReceipt(orders);
      //     console.log(textMsg);
      //     const htmlMsg = htmlReceipt(orders);

      //     sendMsg('tbalmeida@gmail.com', 'Ticketing 4 Good - Your order', textMsg, htmlMsg);
      //     response.json(orders);
      //   })
      //   .catch(e => console.error(e.stack));
      // response.status(200).send(paymentIntent.client_secret);

    } catch (err) {
      console.log("err", err);
      response.status(500).json({ statusCode: 500, message: err.message });
    }
  });

  return router;
};
