'use strict';
const fs = require('fs');
const PDFDocument = require('./pdfkit_tables');
const ENV = require("../environment");
const db = require("../db/");
const { sendMsg, textReceipt, htmlReceipt } = require( "./emailHelper");

function createTicket(orderID) {

  db.query(`SELECT * FROM order_details_vw WHERE order_id = $1 ORDER BY event_date ASC;`, [orderID])
  .then(({rows: order}) => {

    if (order.length > 0) {
      order.forEach(item => {
      })

    } else {
      throw new Error("Order not found.")
    }
  })
  .catch( err => {
  });
return true

  // const doc = new PDFDocument();

  // email confirmation
  // const orderDetails = await db.query(`SELECT * FROM order_details_vw WHERE order_id = $1 ORDER BY event_date ASC;`, [orderID])


  // const textMsg = textReceipt(orderDetails.rows);
  // const htmlMsg = htmlReceipt(orderDetails.rows);
  // sendMsg(userEmail, 'Ticketing 4 Good - Your order', textMsg, htmlMsg);



  // const vFile = 'oRSGFD';
  // doc.pipe(fs.createWriteStream(`tickets/${data.test}.pdf`));

  // const table0 = {
  //     headers: ['Word', 'Comment', 'Summary'],
  //     rows: [
  //         ['Apple', 'Not this one', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla viverra at ligula gravida ultrices. Fusce vitae pulvinar magna.'],
  //         ['Tire', 'Smells like funny', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla viverra at ligula gravida ultrices. Fusce vitae pulvinar magna.']
  //     ]
  // };

  // doc.table(table0, {
  //     prepareHeader: () => doc.font('Helvetica-Bold'),
  //     prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
  // });

  // const table1 = {
  //     headers: ['Country', 'Conversion rate', 'Trend'],
  //     rows: [
  //         ['Switzerland', '12%', '+1.12%'],
  //         ['France', '67%', '-0.98%'],
  //         ['England', '33%', '+4.44%']
  //     ]
  // };

  // doc.moveDown().table(table1, 100, 350, { width: 300 });

  // doc.end();
}

module.exports = { createTicket }

createTicket( 2 );