import { URLValidator } from '../utils/urlValidator.js';

export class URLService {
  /**
   * @param {string[]} allowedDomains - Array of allowed hostnames (optional)
   * @param {object} options - URLValidator options
   */
  constructor(allowedDomains = [], options = {}) {
    this.allowedDomains = allowedDomains;
    this.options = options;
  }

  /**
   * Basic sanitization of URL
   * - Trims whitespace
   * - Normalizes slashes
   * - Removes control characters
   */
  sanitizeURL(url) {
    if (typeof url !== 'string') return '';
    let sanitized = url.trim();
    sanitized = sanitized.replace(/[\u0000-\u001F\u007F]/g, ''); // remove control chars
    sanitized = sanitized.replace(/\\/g, '/'); // normalize backslashes
    return sanitized;
  }

  /**
   * Asynchronous validation
   * Returns true if URL is safe
   */
  async validateURL(url) {
    try {
      return await URLValidator.validate(url, this.allowedDomains, this.options);
    } catch (err) {
      console.error('URL validation error:', err);
      return false;
    }
  }

  /**
   * Synchronous validation
   */
  validateURLSync(url) {
    try {
      return URLValidator.validateSync(url, this.allowedDomains, this.options);
    } catch (err) {
      console.error('URL validation sync error:', err);
      return false;
    }
  }

  /**
   * Full processing of URL
   * - Sanitizes
   * - Validates
   * - Returns structured result
   */
  async processURL(url) {
    const sanitized = this.sanitizeURL(url);

    const isValid = await this.validateURL(sanitized);
    if (!isValid) {
      return {
        original: url,
        sanitized,
        validated: false,
        reason: 'Invalid or unsafe URL',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      original: url,
      sanitized,
      validated: true,
      reason: null,
      timestamp: new Date().toISOString(),
    };
  }
}
