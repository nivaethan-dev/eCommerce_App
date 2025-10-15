import { URLService } from '../services/urlService.js';

// Default configuration
const DEFAULT_URL_CONFIG = {
  allowedDomains: ['example.com', 'api.example.com'],
  options: {
    allowIPs: false,
    timeout: 3000, // DNS lookup timeout in ms
  },
};

// Async URL validation middleware (with DNS verification)
export const urlValidationMiddleware = (customConfig = {}) => {
  const config = { 
    allowedDomains: customConfig.allowedDomains || DEFAULT_URL_CONFIG.allowedDomains,
    options: { ...DEFAULT_URL_CONFIG.options, ...customConfig.options },
  };

  // Reuse single instance of URLService
  const urlService = new URLService(config.allowedDomains, config.options);

  return async (req, res, next) => {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        error: 'URL is required',
        code: 'MISSING_URL',
      });
    }

    const sanitized = urlService.sanitizeURL(url);

    try {
      const result = await urlService.processURL(sanitized);

      if (!result.validated) {
        return res.status(400).json({
          error: 'Invalid or unsafe URL',
          code: 'INVALID_URL',
          details: result.reason,
        });
      }

      // Attach validated URL to request object
      req.validatedUrl = result;
      next();
    } catch (error) {
      console.error('URL middleware error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        code: 'URL_VALIDATION_FAILED',
      });
    }
  };
};

// Quick synchronous URL validation (without DNS)
export const quickUrlValidation = (allowedDomains = DEFAULT_URL_CONFIG.allowedDomains) => {
  // Reuse single instance
  const urlService = new URLService(allowedDomains);

  return (req, res, next) => {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        error: 'URL is required',
        code: 'MISSING_URL',
      });
    }

    const sanitized = urlService.sanitizeURL(url);

    if (!urlService.validateURLSync(sanitized)) {
      return res.status(400).json({
        error: 'Invalid URL format',
        code: 'INVALID_URL',
      });
    }

    req.validatedUrl = {
      original: url,
      sanitized,
      validated: true,
      reason: null,
      timestamp: new Date().toISOString(),
    };

    next();
  };
};
