"use strict";
const fs = require("fs");
const PDFDocument = require("./pdfkit_tables");
const ENV = require("../environment");
const db = require("../db/");


module.exports = function createTicket(order) {
  console.log("Ok", order.length)
  const doc = new PDFDocument;

  doc.pipe(fs.createWriteStream(`./tickets/${order[0].conf_code}-${order[0].order_id}.pdf`));
  doc
    .font('Courier-Bold').fontSize(15)
    .text("Ticketing 4 Good", {align: "center"}, 15).moveDown(0.3)
    .font('Courier').fontSize(12).text("Your tickets are here! Please, bring your ticket to gain access to the event.");

    let line = 80;
    let col = 20;
    let newPage = true;
    
    order.map(item => {
      for(let i = 0; i <= item.qty; i++){
        if (i % 4 === 0 || newPage) {
          i !== 1 ? doc.addPage() : null; 
          line = 80;
          col = 20;
        }

        doc
        .image(`tickets/qr_code/qrc_${item.item_id}.png`,  col, line, {width: 100})
        .font('Courier-Bold').text(item.title, col+110, line+13)
        .moveDown(0.3)
        .text(item.str_event_date + " " + item.str_event_time)
        .moveDown(0.3)
        .font('Courier').text(item.venue)
        .moveDown(0.3)
        .text(item.address + ' ' + item.city + '-' + item.province)
        .moveDown(0.3)
        .text('Ticket ' + i + ' of ' + item.qty);
        line += 160;

        newPage = false
      }
    });

  doc.end();
}

// createTicket(2);
