import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve backend directory for relative uploads path.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    // Store into backend/uploads by default
    cb(null, path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads'));
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    const name = file.originalname.replace(ext, '').replace(/\s+/g, '-');
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${name}-${unique}${ext}`);
  }
});

/**
 * Multer middleware.
 *
 * - Accept single file field named: image
 * - Limit file size: 5MB
 *
 * Stored on disk. We return filename/path in controller.
 */
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    return cb(new Error('Only image files are allowed (jpg, jpeg, png, webp).'));
  }
});

