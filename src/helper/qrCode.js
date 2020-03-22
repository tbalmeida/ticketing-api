const QRCode = require('qrcode')

// Generates a new QR code using the confirmation code (arg data) for each ticket.
// arg id is order_items.id
function getNewQRCode(data, id, path = './qr_code/') {
  QRCode.toFile(`${path}qr_${id}.png`, data, {
    color: {
      dark: '#000000',  // Blue dots
      light: '#ffffffff',
      type: 'png',
      errorCorrectionLevel: 'L',
      margin: 2,
      scale: 2
    }
  }, (err) => {
    if (err) throw err
    return true;
  })
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
