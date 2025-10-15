import express from 'express';
import { urlValidationMiddleware, quickUrlValidation } from '../middleware/urlValidation.js';

const router = express.Router();

// Full validation with DNS lookup
router.post('/submit-url', 
  urlValidationMiddleware(), 
  async (req, res) => {
    try {
      // URL is already validated at this point
      const { validatedUrl } = req;
      
      // Save to database
      // await saveToDatabase(validatedUrl);
      
      res.json({
        message: "URL accepted ✅",
        data: validatedUrl
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
        code: "SERVER_ERROR"
      });
    }
  }
);

// Quick validation for less critical endpoints
router.post('/quick-submit',
  quickUrlValidation(['example.com']),
  async (req, res) => {
    const { url } = req.body;
    
    // Process URL quickly without DNS lookup
    res.json({ message: "URL quickly validated ✅" });
  }
);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'URL Validation' });
});

export default router;