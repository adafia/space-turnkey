const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
require('dotenv').config();

const uri = process.env.MONGODB_CONNECTION_STRING;


const ImageHandler = {
  stream(db, mongo) {
    const gfs = Grid(db, mongo);
    gfs.collection('uploads');
  },

  upload() {
    const storage = new GridFsStorage({
      uri,
      file: (req, file) => new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) return reject(err);
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename,
            bucketName: 'uploads',
          };
          return resolve(fileInfo);
        });
      }),
    });
    return multer({ storage });
  },

};

module.exports = ImageHandler;
