const htmlTicket = `
<html><head>
<link rel="stylesheet" href="" media="all">
</head><body>
<div><h1>Ticketing 4 Good</h1></div>

<div><p>Hello, ${order[0].first_name} ${order[0].last_name}! Thank you for joining us! Here you have your receipt.
</br>Please, keep this receipt for your records.</p></div>

<div><p><b>Your Order</b>
</br><b>Date:</b> dd/mm/yyyy
<br><b>Confirmation code:</b> ${order[0].conf_code} 
</p></div>

<div><p><table>
<tr>
  <th>Event</th>
  <th>Quantity</th>
  <th>Price (each)</th>
  <th>Total</th>
</tr>
<tr>
  <td>${order[0].event}</td>
  <td class="centerText">${order[0].qty}</td>
  <td class="numberData">${order[0].price}</td>
  <td class="numberData">${order[0].line_total}</td>
</tr>
<tr><tfoot>
  <td colspan=3>Total</td>
  <td class="numberData">$ ${order[0].total}</td>
</tr></tfoot>
</table>
<p><br></p></div>

<div>
<p><hr class="dash"><br></p>
<h2>Tickets</h2>`

const htmlTicketItem = `<p><table class="ticket">
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

const cssTicket = `
body {
  font-family: 'Lucida Grande', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  padding: 100px;
  font-size: 13px;
  background-color: white
}

table {
  width: 700px;
  font-size: 13px;
}

th {
background-color: whitesmoke
}
tfoot {
  font-weight: bold;
}
td {
  text-align: left;
}

.numberData {
  text-align: right;
}

.qr_code {
  width: 303px;
  text-align: center;
  vertical-align: middle;
 }
 
.dash{
  border: 0 none;
  border-top: 2px dashed #322f32;
  background: none;
  height:0;
} 
`;

module.exports = { htmlTicket, htmlTicketItem, cssTicket };