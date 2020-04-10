const Stripe = require("stripe");

const stripe = new Stripe(process.env.SECRET_KEY);

function processPayment(amount) {
  try {
    const { amount  } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "cad"
    });

    return paymentIntent.client_secret;
  } catch (err) {
    return { statusCode: 500, message: err.message };
  }
}

module.exports = { processPayment };