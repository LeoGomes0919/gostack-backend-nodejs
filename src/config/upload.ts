import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tempFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tempFolder,

  storage: multer.diskStorage({
    destination: tempFolder,
    filename(req, file, cb) {
      const fileHas = crypto.randomBytes(10).toString('hex');

      const name = `${fileHas}-${file.originalname}`;

      return cb(null, name);
    },
  }),
};
