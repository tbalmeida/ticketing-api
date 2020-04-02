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
      margin: 2,
      scale: 2
    }
  }, (err) => {
    if (err) throw err
  })
  return filename.toString();
}

module.exports = { getNewQRCode };