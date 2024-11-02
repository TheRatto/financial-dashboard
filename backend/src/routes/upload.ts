import express from 'express';
import multer from 'multer';
import { handleFileUpload } from '../controllers/uploadController';

const router = express.Router();

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
}).single('file');

// Wrap the route to handle multer errors
router.post('/', (req: express.Request, res: express.Response) => {
  console.log('Starting upload process');
  
  return upload(req, res, (err) => {
    console.log('Multer process complete', { 
      error: err ? err.message : 'none',
      hasFile: !!req.file 
    });

    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      console.error('Non-multer error:', err);
      return res.status(500).json({
        success: false,
        message: 'Upload failed'
      });
    }
    
    return handleFileUpload(req, res);
  });
});

// Add this before your main upload route
router.get('/test', (_req, res) => {
  res.json({ message: 'Upload endpoint is working' });
});

export default router; 