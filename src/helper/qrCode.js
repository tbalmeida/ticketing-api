const QRCode = require('qrcode')

// Generates a new QR code using the confirmation code (arg data) for each ticket.
// arg id is order_items.id
function getNewQRCode(data, id, path = './tickets/qr_code') {
  const filename = `${path}qrc_${id}.png`;
  QRCode.toFile(filename, data, {
    color: {
      dark: '#000000', 
      light: '#ffffffff',
      type: 'image/png',
      errorCorrectionLevel: 'L',
      margin: 1,
      width: 300
    }
  }, (err) => {
    if (err) throw err
  })
  return filename.toString();
}

module.exports = { getNewQRCode };


// option: Using Denso API
// const https = require('https')
// const options = {
//   hostname: 'api.qrserver.com',
//   port: 443,
//   path: '/v1/create-qr-code/?size=150x150&data=3@U17984583336FE1C7394AF8160',
//   method: 'GET'
// }

// const req = https.request(options, res => {
//   console.log(`statusCode: ${res.statusCode}`)

//   res.on('data', d => {
//     process.stdout.write(d)
//   })
// })

// req.on('error', error => {
//   console.error(error)
// })

// req.end()
