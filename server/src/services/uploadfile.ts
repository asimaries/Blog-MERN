import { Request } from 'express'
import multer from 'multer'
import fs from 'fs'
import { User } from '../controllers/blog'

const storageForBlog = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    const user = req.user as User
    const directory = `./public/uploads/${user.id}`
    if (!fs.existsSync(directory))
      fs.mkdirSync(directory, { recursive: true })
    cb(null, directory)
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const filename = `${Date.now()}-${file.originalname}`
    cb(null, filename)
  }
})

export { storageForBlog }