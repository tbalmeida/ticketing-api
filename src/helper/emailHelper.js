const nodemailer = require('nodemailer');
const {getNewQRCode} = require("./qrCode");

function sendMsg (to, subject, text, HTML, arrayAttach =[]) {
	
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
		user: process.env.EMAIL || 'ticketing4good@gmail.com', 
		pass: process.env.PASSWORD || 'FinalProject'
		}
	});
	
	const mailOptions = {
		from: process.env.EMAIL, 
		to: to,
		bcc: 'ticketing4good@gmail.com',
		subject: subject,
		text: text,
		html: HTML,
		attachments: arrayAttach
	};
	
	transporter.sendMail(mailOptions, (err, data) => {
		if (err) {
			return console.log('Error:', err);
		}
			return console.log('Email sent!');
	});
};

function textReceipt(data) {
	
	let orderTotal = 0;

	let msgReceipt = `RECEIPT - Ticketing 4 Good\n\n`+
	`Hello, ${data[0].first_name} ${data[0].last_name}. Thank you for your order. The description is as follows:\n\n`+
	`Order confirmation: ${data[0].conf_code}\n`+
	`Date: ${data[0].str_order_date}\n`

	data.forEach(e => {
		msgReceipt += `\n\n- ${e.title}\n  ${e.str_event_date} at ${e.str_event_time}}\n  Cost: ${e.qty} x ${e.price} = ${e.line_total}`;
		orderTotal += (e.qty * e.vl_price);
	});

	msgReceipt += `\n\n\nOrder Total: $${orderTotal}\n\n\nThis is not your ticket`

	return msgReceipt;
// sendMsg('tbalmeida@gmail.com', `Order ${orders[0].order_id}`, conf_Msg)
};

function htmlReceipt(data) {
	
	let orderTotal = 0;

	let msgReceipt = `<h1>RECEIPT - Ticketing 4 Good</h1>`+
	`<p>Hello, ${data[0].first_name} ${data[0].last_name}. Thank you for your order. The description is as follows:`+
	`<br><b>Order confirmation:</b> ${data[0].conf_code}`+
	`<br><b>Date:</b> ${data[0].str_order_date}</p>` +
	`<table style="width: 500pt"><thead><tr> <th>Event</th> <th>Quantity</th> <th>Price</th> <th>Total</th> </tr></thead>` +
  `<tbody>`

	data.forEach(e => {
		msgReceipt += `<tr><td>${e.title}<br>${e.str_event_date} at ${e.str_event_time}</td>` +
		`<td>${e.qty}</td> <td align=right>${e.price}</td> <td align=right>${e.line_total}</td></tr>`
		orderTotal += (e.qty * e.vl_price);
	});

	msgReceipt += `<tr><td colspan=3><b>Order Total</b></td><td align=right> <b>$${orderTotal.toFixed(2)}</b></tr></tbody>` +
	`<tr><tfoot><td colspan=4><i>This is not a ticket</i></td></tr></tfoot></table>`

	return msgReceipt;
// sendMsg('tbalmeida@gmail.com', `Order ${orders[0].order_id}`, conf_Msg)
};

function createReceipt(order, amount) {
	// Creates an email with receipt and tickets for the order passed as argument

	// saves the filenames of the newly created QR codes
	const qrCodes = [];
	const attachments = [];

	order.forEach((item) => {
		for (let i = 1; i <= item.qty; i++) {
			// creates a QR for each instance of ticket purchased
			qrCodes.push(getNewQRCode(item.qr_code + `|${i}|${item.qty}`, `${item.item_id}_${i}`, "tickets/qr_code/"));
		}
	}); 

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

	// finalize html
	msgReceipt += `</tbody><tfoot>
	<tr><td colspan=3>Total</td><td style="text-align: right">$ ${(amount/100).toFixed(2)}</td>
	</tr></tfoot></table><p><br></p></div>`;

	msgTickets += `</div></body></html>`

	sendMsg("tbalmeida@gmail.com", "Tickets 4 Good - Receipt", "Receipt from Tickets 4 Good", msgGreetings + msgReceipt + msgTickets, attachments);
}

module.exports = {sendMsg, textReceipt, htmlReceipt, createReceipt };