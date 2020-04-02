const PORT = process.env.PORT || 8001;
const ENV = require("./environment");

// const app = require("./application")(ENV, { updateAppointment });
const app = require("./application")(ENV);
const server = require("http").Server(app);

server.listen(PORT, () => {
  console.log(`T4G - Listening on port ${PORT} in ${ENV} mode.`);
});
