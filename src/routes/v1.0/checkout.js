const router = require("express").Router();
const Stripe = require("stripe");

const stripe = new Stripe(process.env.SECRET_KEY);
// console.log("stripe", stripe)

module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { amount  } = req.body;

      //database needs to save the purchase info


      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "cad"
      });

      res.status(200).send(paymentIntent.client_secret);
    } catch (err) {
      console.log("err", err)
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};