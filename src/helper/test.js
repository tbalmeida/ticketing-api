const ENV = require("./../environment");
const db = require("../db");
const {getNewQRCode} = require("./qrCode");
// const {htmlTicket} = require("./htmlContent");

const createTicket = require("./ticket");
const { sendMsg, textReceipt, htmlReceipt } = require( "./emailHelper");
const orderID = 2;

// saves the filenames of the newly created QR codes
const qrCodes = [];

// get order data
db.query(`SELECT * FROM order_details_vw WHERE order_id = $1`, [orderID])
  .then(({ rows: order }) => {

    order.forEach((item) => {
      for (let i = 1; i <= item.qty; i++) {
        // creates a QR for each instance of ticket purchased
        qrCodes.push(getNewQRCode(item.qr_code + `|${i}|${item.qty}`, `${item.item_id}_${i}`, "tickets/qr_code/"));
      }
    }); 

    return order;
  })

  .then(order => {  //Header
    // checks the total value
    const amount = order.reduce((acc, item) => acc + (item.vl_price * item.qty), 0) * 100; 

    const msgConfig = `<html><header>
    <title>Ticket 4 Good - Receipt</title>
    </header><body style="font-family: 'Lucida Grande', 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 100px; font-size: 13px; background-color: white;">`;

    const msgGreetings = `<div><p>Hello, ${order[0].first_name} ${order[0].last_name}! Thank you for joining us! Here you have your receipt.
    </br>Please, keep this receipt for your records.</p></div>
    <div><p><b>Your Order</b>
    </br><b>Date:</b> ${order[0].str_order_date}
    <br><b>Confirmation code:</b> ${order[0].conf_code}|${order[0].order_id}
    <br><b>Total:</b> ${amount} 
    </p></div>`;

    let msgReceipt = `<div><p><table style="width: 700px; font-size: 13px;">
    <thead><tr style="background-color: whitesmoke">
       <th>Event</th>
       <th>Quantity</th>
       <th>Price (each)</th>
       <th>Total</th>
     </tr></thead>`

    let msgTickets = `<div><p><hr style="border: 0 none;border-top: 2px dashed #322f32;background: none;height:0"><br></p><h2>Tickets</h2>`;

    const attachments = [];

    order.forEach(item => {
      // complements the receipt table      
      msgReceipt += ` <tr>
         <td>${item.title}</td>
         <td style="text-align: center">${item.qty}</td>
          <td style="text-align: right">${item.price}</td>
          <td style="text-align: right">${item.line_total}</td>
        </tr>`;

      for (let i = 1; i <= item.qty; i++) {
        // creates a ticket for each instance of ticket purchased
        // qrCodes.push(getNewQRCode(item.qr_code + `|${i}|${item.qty}`, item.item_id, "tickets/qr_code/"));
        msgTickets += `<p><br><table style="border: 2px dashed #322f32; padding: 2px; width: 700px;">
        <tr><td rowspan=4 style="text-align: center;vertical-align: middle; width: 200px"><img src="cid:qrc_${item.item_id}_${i}.png" /></td></tr>
        <tr><td><b>${item.title}</b></td><td style="text-align: right"><b>${item.str_event_date} ${item.str_event_time}</b></td></tr>
        <tr><td colspan=2 style="vertical-align: top">${item.venue}</td></tr>
        <tr><td colspan=2 style="vertical-align: top">${item.address}<br>${item.city}-${item.province}</td></tr>
        </table><br>Please present this ticket for admission</p>`;

        attachments.push({
          filename: `qrc_${item.item_id}_${i}.png`,
          path: `tickets/qr_code/qrc_${item.item_id}_${i}.png`,
          cid: `qrc_${item.item_id}_${i}.png`
          });
      }
    });

    msgReceipt += `</tbody><tfoot>
      <tr><td colspan=3>Total</td><td style="text-align: right">$ ${(amount/100).toFixed(2)}</td>
      </tr></tfoot></table><p><br></p></div>`;

    msgTickets += `</div></body></html>`
    
    // console.log(msgReceipt)
// "lakondo@deloitte.ca"
    sendMsg("tbalmeida@gmail.com", "Tickets 4 Good - Receipt", "Receipt from Tickets 4 Good", msgGreetings + msgReceipt + msgTickets, attachments);
// console.log(msgGreetings + msgReceipt + msgTickets)
  })
. catch(e => console.error(e.stack));