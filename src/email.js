const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	user: process.env.EMAIL || 'ticketing4good@gmail.com', 
	pass: process.env.PASSWORD || 'FinalProject'
	}
});

const sendEmail = function(to, subject, text, HTML) {
	const mailOptions = {
		from: process.env.EMAIL, 
		to: to,
		subject: subject,
		text: text,
		HTML: HTML
	};
	
	transporter.sendMail(mailOptions, (err, data) => {
		console.log(transporter)
		if (err) {
			return console.log('Error occurs', err);
		}
			return console.log('Email sent!!!');
	});

}

sendEmail("tbalmeida@gmail.com", "Testing system - veja isso", "teste sem html", "Funcionando? <i>Sei nao</i>")