import multer from 'multer';

// Memory storage for fast streaming and parsing of uploaded PDF/TXT files
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});
