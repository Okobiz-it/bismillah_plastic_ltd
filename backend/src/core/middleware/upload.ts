import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/octet-stream',
];

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.pdf', '.doc', '.docx'];

export const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Supported formats: JPG, JPEG, PNG, WEBP, AVIF, PDF, DOC, DOCX.'));
    }
  },
});

import os from 'os';
import fs from 'fs';

const allowedVideoMimeTypes = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/ogg',
  'video/x-matroska',
  'video/avi',
  'video/mpeg',
  'video/3gpp',
];

const allowedVideoExtensions = ['.mp4', '.webm', '.mov', '.ogg', '.mkv', '.avi', '.3gp'];

const videoTempDir = path.join(os.tmpdir(), 'bismillah_plastic_videos');
if (!fs.existsSync(videoTempDir)) {
  fs.mkdirSync(videoTempDir, { recursive: true });
}

const videoDiskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(videoTempDir)) {
      fs.mkdirSync(videoTempDir, { recursive: true });
    }
    cb(null, videoTempDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `video-${uniqueSuffix}${ext}`);
  },
});

export const videoUpload = multer({
  storage: videoDiskStorage,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB video limit (1024MB)
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedVideoMimeTypes.includes(file.mimetype) || allowedVideoExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid video format. Supported formats: MP4, WebM, MOV, OGG, MKV, AVI.'));
    }
  },
});

