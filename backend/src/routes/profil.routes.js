import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth.middleware.js';
import { getProfil, updateProfil, uploadFoto, updatePassword } from '../controllers/profil.controller.js';

const router = Router();

// Setup multer untuk foto profil
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `profil_${req.user.id}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ok = ['.jpg', '.jpeg', '.png', '.webp'];
    ok.includes(path.extname(file.originalname).toLowerCase())
      ? cb(null, true)
      : cb(new Error('Format tidak didukung. Gunakan JPG/PNG/WEBP.'));
  },
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

router.get('/', authenticate, getProfil);
router.patch('/', authenticate, updateProfil);
router.post('/foto', authenticate, upload.single('foto'), uploadFoto);
router.patch('/password', authenticate, updatePassword);

export default router;