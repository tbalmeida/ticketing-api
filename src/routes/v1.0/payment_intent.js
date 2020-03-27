const Stripe = require("stripe");
const db = require("../../db");

const stripe = new Stripe(process.env.SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { amount, cartItems, handle } = req.body;
      // console.log("req.body", cartItems)

      // gets the user.id to create an order
      const vUser = await db.query('SELECT id FROM users WHERE handle = $1', [handle])

      // Check for valid user and cart
      if (cartItems.length > 0 && vUser.rowCount === 1 ) {
        const userID = vUser.rows[0].id;
        let sqlOrderItems = ``;

        // checks the total value
        const amount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) * 100;

        // charges on Stripe
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: "cad",
          metadata: {integration_check: 'accept_a_payment'},
          description: "Ticketing 4 Good - tickets for events"
        });

        // Creates the order on the db
        const vOrder = await db.query(`INSERT INTO orders (user_id, order_date, status) VALUES ( ${userID}, now(), 2) RETURNING id;`)
        const orderID = vOrder.rows[0].id;

        cartItems.forEach(item => {
          let { id, quantity } = item;
          // adds a comma if it's not the first item
          sqlOrderItems += sqlOrderItems.length > 0 ? `, ` : ``;
          sqlOrderItems += `( ${orderID}, ${id}, ${quantity})`
        });
        sqlOrderItems = `INSERT INTO order_items (order_id, event_id, qty) VALUES ` + sqlOrderItems + `;`
        // console.log(sqlOrderItems);

        const vOrderItems = await db.query(sqlOrderItems);

        // res.status(200).send("All good!")
        // console.log(paymentIntent);
        res.status(200).send(paymentIntent.client_secret);

      }

    } catch (err) {
      console.log("err", err)
      res.status(500).json({ statusCode: 500, message: err.message });
    }

  } else {
    res.setHeader("Allow", "PUT");
    res.status(405).end("Method Not Allowed");
  }
};
