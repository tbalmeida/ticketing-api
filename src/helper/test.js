const db = require("../../db");
// const createTicket = require("../../helper/ticket");
const { sendMsg, textReceipt, htmlReceipt } = require( "../../helper/emailHelper");

const fila = new Promise((resolve, reject) => {
  console.log("Inicio da fila");
  if (1 === 1) {
    const orderDetails = await db.query(`SELECT * FROM order_details_vw WHERE order_id = $1 ORDER BY event_date ASC;`, [orderID])
    resolve("Tudo ok");
  } else {
    reject("Deu ruim");
  }
});

fila.then(msg => {
  console.log("1. msg aqui", msg);
})
.then(() => {
  console.log("2. Segunda mensagem");
  // const textMsg = textReceipt(orderDetails.rows);
  // const htmlMsg = htmlReceipt(orderDetails.rows);
  // sendMsg(userEmail, 'Ticketing 4 Good - Your order', textMsg, htmlMsg);

})
.catch(msg => {
  console.log("Catch error! ", msg);
});

// sendMsg("tbalmeida@gmail.com", "Testing system - veja isso", "teste sem html", "Funcionando? <i>Sei nao</i>")