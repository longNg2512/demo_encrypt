// install package hoặc nhấn F5 để chạy
import * as fs from 'node:fs'
import crypto from 'crypto'

// Đường dẫn đến file gốc
// Chưa handle mấy case sai đường dẫn, file rỗng các kiểu
const filePath = 'test.jpg'
// Đường dẫn đến file đã mã hoá
const encryptedFilePath = `encrypted_${filePath}`
// Đường dẫn đến file đã giải mã
const decryptedFilePath = `decrypted_${encryptedFilePath}`

// Hàm tính và hiển thị file size
const calcFileSize = filePath => {
  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error(err)
      return
    }

    // Dung lượng của tệp tin (trong đơn vị byte)
    const fileSizeInBytes = stats.size

    // Dung lượng của tệp tin (định dạng đọc được MB)
    const fileSizeInMB = fileSizeInBytes / 1024 / 1024
    console.log(`Dung lượng của tệp tin ${filePath} là: ${fileSizeInMB} MB`)
  })
}

// secret key
const encryptionKey = crypto
  .createHash('sha512')
  .update('ném key vào đây :D')
  .digest('hex')
  .substring(0, 32)

// initialization vector
const encryptionIV = crypto
  .createHash('sha512')
  .update('ném iv vào đây :v')
  .digest('hex')
  .substring(0, 16)

// Hàm để mã hoá file
function encryptFile(filePath, encryptedFilePath, key, iv) {
  // Ghi lại thời gian bắt đầu
  const startTime = new Date()

  // Tạo stream đọc file gốc
  const readStream = fs.createReadStream(filePath)

  // Tạo stream ghi file mã hoá
  const writeStream = fs.createWriteStream(encryptedFilePath)

  // Tạo đối tượng mã hoá AES với IV và khóa
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)

  // Ghi IV vào đầu file đã mã hoá
  writeStream.write(iv)

  // Gắn stream ghi vào đối tượng mã hoá
  const encryptedStream = readStream.pipe(cipher).pipe(writeStream)

  // Xử lý sự kiện khi quá trình mã hoá hoàn thành
  encryptedStream.on('finish', () => {
    // Ghi lại thời gian kết thúc
    const endTime = new Date()

    // Tính thời gian mã hoá file
    const elapsedTime = endTime - startTime

    // Chuyển đổi thời gian thành phút:giây
    const minutes = Math.floor(elapsedTime / 60000)
    const seconds = ((elapsedTime % 60000) / 1000).toFixed(0)

    calcFileSize(filePath)
    console.log(`Thời gian mã hoá file: ${minutes} phút ${seconds} giây`)
    console.log('Mã hoá file video thành công.')
  })

  // Xử lý sự kiện khi có lỗi xảy ra trong quá trình mã hoá
  encryptedStream.on('error', error => {
    console.error('Đã xảy ra lỗi trong quá trình mã hoá:', error)
  })
}

// Hàm để giải mã file
function decryptFile(encryptedFilePath, decryptedFilePath, key, iv) {
  // Ghi lại thời gian bắt đầu
  const startTime = new Date()

  // Tạo stream đọc file đã mã hoá
  // Bug mãi chỗ này, không hiểu sao thêm {start: 16} lại được :v
  const readStream = fs.createReadStream(encryptedFilePath, { start: 16 })

  // Tạo stream ghi file giải mã
  const writeStream = fs.createWriteStream(decryptedFilePath)

  // Tạo đối tượng giải mã AES với IV và khóa
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)

  // Gắn stream ghi vào đối tượng giải mã
  const decryptedStream = readStream.pipe(decipher).pipe(writeStream)

  // Xử lý sự kiện khi quá trình giải mã hoàn thành
  decryptedStream.on('finish', () => {
    // Ghi lại thời gian kết thúc
    const endTime = new Date()

    // Tính thời gian giải mã file
    const elapsedTime = endTime - startTime

    // Chuyển đổi thời gian thành phút:giây
    const minutes = Math.floor(elapsedTime / 60000)
    const seconds = ((elapsedTime % 60000) / 1000).toFixed(0)

    calcFileSize(encryptedFilePath)
    console.log(`Thời gian giải mã file: ${minutes} phút ${seconds} giây`)
    console.log('Giải mã file video thành công.')
  })

  // Xử lý sự kiện khi có lỗi xảy ra trong quá trình giải mã
  decryptedStream.on('error', error => {
    console.error('Đã xảy ra lỗi trong quá trình giải mã:', error)
  })
}

// Chưa xử lí bất đồng bộ nên gọi 1 hàm tại 1 thời điểm ạ

// Gọi hàm mã hoá file với các thông số đầu vào
encryptFile(filePath, encryptedFilePath, encryptionKey, encryptionIV)

// Gọi hàm giải mã file với các thông số đầu vào
// decryptFile(encryptedFilePath, decryptedFilePath, encryptionKey, encryptionIV)
