const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyparser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

const app = express();
const db = require("./db");

const venues = require("./routes/v1.0/venues");
const events = require("./routes/v1.0/events");
const users  = require("./routes/v1.0/users");
const orders = require("./routes/v1.0/orders");

// used to read files when on Dev or Test env
function read(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      file,
      {
        encoding: "utf-8"
      },
      (error, data) => {
        if (error) return reject(error);
        resolve(data);
      }
    );
  });
}

module.exports = function application(
  ENV //, actions = { updateAppointment: () => {} }
) {
  app.use(cors());
  app.use(helmet());
  app.use(bodyparser.json());

  // API v1.0 - created for the finals
  app.use("/api/1.0/", venues(db));
  app.use("/api/1.0/", events(db));
  app.use("/api/1.0/", users(db) );
  app.use("/api/1.0/", orders(db));

  // allows reset of the database when on Dev or Test env
  if (ENV === "development" || ENV === "test") {
    Promise.all([
      read(path.resolve(__dirname, `db/schema/create.sql`)),
      read(path.resolve(__dirname, `db/schema/${ENV}.sql`))
    ])
      .then(([create, seed]) => {
        app.get("/api/debug/reset", (request, response) => {
          db.query(create)
            .then(() => db.query(seed))
            .then(() => {
              console.log("Database Reset");
              response.status(200).send("Database Reset");
            });
        });
      })
      .catch(error => {
        console.log(`Error setting up the reset route: ${error}`);
      });
  }

  app.close = function() {
    return db.end();
  };

  return app;
};
