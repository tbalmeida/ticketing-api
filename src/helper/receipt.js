const sendMsg = require( "../../helper/emailHelper");

db.query(`SELECT * FROM orders_vw WHERE user_handle = $1 ORDER BY order_date DESC, event_date DESC;
`, [request.params.id])
.then(({ rows: orders }) => {
  response.json(orders);
});