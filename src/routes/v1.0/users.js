const router = require("express").Router();

module.exports = db => {

  
  // New user
  router.put("/signup", (request, response) => {
    db.query(`
      INSERT INTO users (first_name, last_name, email, password) 
      VALUES ($1, $2, $3, $4) RETURNING *;
     `, [request.body.first_name, request.body.last_name, request.body.email, request.body.password])
     .then(({ rows: users }) => { response.json(users) })
     .catch(e => console.error(e.stack));
  });

  // select * from users where email = 'john@fake.com' and password = '123'
  // User login
  router.post("/login", (request, response) => {
    console.log("Check:", request.body);
    db.query(`
      SELECT * FROM users WHERE email = $1 and password = $2;
     `, [ request.body.email,
          request.body.password ])
     .then(({ rows: users }) => { response.json(users) })
     .catch(e => console.error(e.stack));
  });

  // User update
  router.patch("/user/:id", (request, response) => {
    db.query(`
      UPDATE users
      SET first_name = $3, last_name = $4, email = $5, password = $6
      WHERE email = $1 AND password = $2 RETURNING *;
     `, [
        request.body.email,
        request.body.password,
        request.body.first_name,
        request.body.last_name,
        request.body.new_email,
        request.body.new_password
     ])
     .then(({ rows: users }) => { response.json(users) })
     .catch(e => console.error(e.stack));
  });

  return router;
};
