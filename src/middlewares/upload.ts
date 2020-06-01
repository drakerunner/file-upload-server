import { UNSUPPORTED_MEDIA_TYPE, INTERNAL_SERVER_ERROR, BAD_REQUEST } from 'http-status-codes';
import { RequestHandler } from 'express';

import * as multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

import validateFilename from '../validators/validateFilename';

const mimeTypesWhiteList = ['image/png', 'image/jpg', 'image/jpeg']

const _10MB = 10485760;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public'),
  filename: (req, file, cb) => {
    const validation = validateFilename(file.originalname);

    if (validation.isValid()) {
      cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
    }
    else {
      cb(new BadRequestError(), "");
    }
  }
});

const upload = multer({
  storage,
  limits: {
    files: 1,
    fileSize: _10MB
  },
  fileFilter: (req, file, cb) => {
    const { mimetype } = file;
    if (mimeTypesWhiteList.indexOf(mimetype) < 0) {
      cb(new UnsupportedMediaTypeError())
    }

    cb(null, true);
  }
}).single('file');

const uploadHanler: RequestHandler = (req, res, next) => {
  upload(req, res, (err: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (err instanceof UploadError) return res.status(err.code).json();
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') return res.status(413).json();
    if (err) return res.status(INTERNAL_SERVER_ERROR).json();

    return next();
  });
}

class UploadError extends Error {
  code = 0;
}

class UnsupportedMediaTypeError extends UploadError {
  code = UNSUPPORTED_MEDIA_TYPE;

  constructor() {
    super('UNSUPPORTED_MEDIA_TYPE');
  }
}

class BadRequestError extends UploadError {
  code = BAD_REQUEST;

  constructor() {
    super('BAD_REQUEST');
  }
}

export default uploadHanler;
