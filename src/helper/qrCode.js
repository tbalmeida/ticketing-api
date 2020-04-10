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
