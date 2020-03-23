const router = require("express").Router();

module.exports = db => {
  // route to get all the orders. Should be protected, only for system
  router.get("/orders", (request, response) => {
    db.query(
      `
      SELECT *
      FROM orders_vw
     `)
     .then(({ rows: orders }) => {
      response.status(200).json(orders);
    });
  });

  router.get("/orders/:id", () => {
    db.query(`
    `)
    .then(() => {});
  })


  // route to delete an event
  // router.delete("/orders/:id", (request, response) => {
  //   if (process.env.TEST_ERROR) {
  //     setTimeout(() => response.status(500).json({}), 1000);
  //     return;
  //   }

  //   db.query(`DELETE FROM orders WHERE id = $1::integer`, [
  //     request.params.id
  //   ]).then(() => {
  //     setTimeout(() => {
  //       response.status(204).json({});
  //       updateAppointment(Number(request.params.id), null);
  //     }, 1000);
  //   });
  // });

  return router;
};
