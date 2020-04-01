const router = require("express").Router();
const bcrypt = require("bcrypt");

module.exports = db => {

  // Signup: creates a new user only if the email isn't registered already
  router.put("/signup", async (request, response) => {
    const hashedPassword = await bcrypt.hash(request.body.password, 12)
    // console.log("hashedPassword", hashedPassword)
    db.query(`SELECT COUNT(id) AS total FROM users WHERE email = $1`, [request.body.email])
    .then(({rows}) => {
      console.log("Email occurances in DB: ", rows[0].total); 
      if (rows[0].total == 0) {
        db.query(`INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *;`, 
          [request.body.first_name, request.body.last_name, request.body.email, hashedPassword])
        .then(({ rows: users }) => { response.status(201).json(users) });
      } else {
        response.status(409).json({message: `User already registered`});
      }
    })
    .catch(e => console.error(e.stack));
  });


  // User login
  router.post("/login", async (request, response) => {
    const user = await db.query(`SELECT handle, id, first_name, last_name, email, password FROM users WHERE email = $1;`
    , [request.body.email ]);
  
    if(user.rowCount > 0){
      const isPasswordMatched = await bcrypt.compare(request.body.password, user.rows[0].password);
      if (isPasswordMatched) {
        return response.status(200).json(user.rows);
      } 
    }
    // user not found/match, return error
    return response.status(500).json({message: "User not found. Please, verify the email and password provided."})
  });

  // User update
  router.patch("/user/:id", async (request, response) => {
    const hashedPassword = await bcrypt.hash(request.body.password, 12);
    db.query(`UPDATE users SET first_name = $2, last_name = $3, email = $4, password = $5
      WHERE handle = $1 RETURNING *;`,
      [ request.params.id,
        request.body.first_name,
        request.body.last_name,
        request.body.email,
        hashedPassword
      ])
     .then(({ rows: users }) => { response.status(200).json(users) })
     .catch(e => console.error(e.stack));
  });

  return router;
};
