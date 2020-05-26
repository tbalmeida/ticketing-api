const PORT = process.env.PORT || 8001;
const ENV = require("./environment");

// const app = require("./application")(ENV, { updateAppointment });
const app = require("./application")(ENV);
const server = require("http").Server(app);


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: 'tbalmeida@gmail.com',
  from: 'ticketing4good@gmail.com',
  subject: 'Testing',
  text: 'Testing',
  html: '<h1>HTML version</h1><p>Testing</p>',
};
sgMail.send(msg);

server.listen(PORT, () => {
  console.log(`T4G - Listening on port ${PORT} in ${ENV} mode.`);
});
