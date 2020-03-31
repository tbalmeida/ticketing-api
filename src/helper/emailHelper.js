const nodemailer = require('nodemailer');

function sendMsg (to, subject, text, HTML) {
	
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
		html: HTML
	};
	
	transporter.sendMail(mailOptions, (err, data) => {
		if (err) {
			return console.log('Error:', err);
		}
			return console.log('Email sent!');
	});
};

function sendMsgAttach (to, subject, text, HTML, PDF) {
	
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
		subject: subject,
		text: text,
		html: HTML,
		attachments: [
			{
					filename: PDF,
					path: `./tickets/${PDF}`, //path.join(__dirname, '../output/file-name.pdf'), // <= Here
					contentType: 'application/pdf'
			}
	]
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

function generateTicket(data) {

	// "/src/helper/style.css"
	const htmlTicket = `
	<div><h1>Ticketing 4 Good</h1></div>

	<div><p>Hello, ${first_name} &{last_name}! Thank you for joining us! Here you have your receipt.
	</br>Please, keep this receipt for your records.</p></div>
	
	<div><p><b>Your Order</b>
	</br><b>Date:</b> dd/mm/yyyy
	<br><b>Confirmation code:</b> ${data.conf_code} 
	</p></div>
	
	<div><p><table>
	<tr>
		<th>Event</th>
		<th>Quantity</th>
		<th>Price (each)</th>
		<th>Total</th>
	</tr>
	<tr>
		<td>${event}</td>
		<td class="centerText">${qty}</td>
		<td class="numberData">${price}</td>
		<td class="numberData">${linte_total}</td>
	</tr>
	<tr><tfoot>
		<td colspan=3>Total</td>
		<td class="numberData">$ ${total}</td>
	</tr></tfoot>
	</table>
	<p><br></p></div>
	
	<div>
	<p><hr class="dash"><br></p>
	<h2>Tickets</h2>`
	
	const ticketTable = `<p><table class="ticket">
	<tr><td rowspan=4 class="qr_code">qr code</td></tr>
	<tr>
		<td>Event</td>
		<td class="numberData">date/time</td>
	</tr>
	<tr><td colspan=2>Venue</td></tr>
	<tr><td colspan=2>Address<br>City-Province</td></tr>
	</table>
	<br>Please present this ticket for admission
	</p>
	</div>
	`
}

module.exports = {sendMsg, textReceipt, htmlReceipt, generateTicket, sendMsgAttach };