// const sendMsg = require( "../../helper/emailHelper");
const db = require("../db");

db.query(`SELECT * FROM orders_vw WHERE user_handle = $1 ORDER BY order_date DESC, event_date DESC;
`, [4])
.then(({ rows: orders }) => {
  response.json(orders);
});