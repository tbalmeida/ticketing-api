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

module.exports = (sendMsg)