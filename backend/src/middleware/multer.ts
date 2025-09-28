import multer from 'multer'

const storage = multer.diskStorage({
  filename: function (_req, file, callback) {
    callback(null, file.originalname)
  },
})

const upload = multer({ storage })

export default upload
// Modificado em Sun Oct  5 15:01:51 -03 2025
