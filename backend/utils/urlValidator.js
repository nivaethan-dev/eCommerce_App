import dns from 'dns/promises';
import net from 'net';
import { URL } from 'url';

export class URLValidator {
  static DEFAULT_OPTIONS = {
    allowIPs: false,
    allowedPorts: ['80', '443'],
    maxLength: 2083,
    allowedProtocols: ['http:', 'https:'],
    dnsTimeout: 5000, // milliseconds
  };

  /**
   * Validate URL asynchronously (with DNS verification)
   */
  static async validate(url, allowedDomains = [], options = {}) {
    const config = { ...this.DEFAULT_OPTIONS, ...options };

    // Basic checks
    if (!this.#basicValidation(url, config)) return false;

    const parsed = this.#parseURL(url);
    if (!parsed) return false;

    if (!this.#protocolCheck(parsed, config)) return false;
    if (!this.#portCheck(parsed, config)) return false;
    if (!this.#pathTraversalCheck(parsed)) return false;

    return await this.#domainValidation(parsed, allowedDomains, config);
  }

  static #basicValidation(url, config) {
    return url && typeof url === 'string' && url.length <= config.maxLength;
  }

  static #parseURL(url) {
    try {
      return new URL(url);
    } catch {
      return null;
    }
  }

  static #protocolCheck(parsed, config) {
    return config.allowedProtocols.includes(parsed.protocol);
  }

  static #portCheck(parsed, config) {
    return !parsed.port || config.allowedPorts.includes(parsed.port);
  }

  static #pathTraversalCheck(parsed) {
    const decoded = decodeURIComponent(parsed.pathname);
    const normalized = decoded.replace(/\\/g, '/');
    return !normalized.includes('..');
  }

  static async #domainValidation(parsed, allowedDomains, config) {
    // Exact domain whitelist
    if (allowedDomains.length > 0 && !allowedDomains.includes(parsed.hostname)) {
      return false;
    }

    // IP check
    if (!config.allowIPs) {
      if (net.isIP(parsed.hostname)) return false;

      // DNS verification
      try {
        const dnsResult = await this.#dnsLookupWithTimeout(parsed.hostname, config.dnsTimeout);

        if (!dnsResult) return false;

        // Ensure resolved IP is not private
        const address = dnsResult.address;
        if (this.#isPrivateIP(address)) return false;

        return true;
      } catch {
        return false;
      }
    }

    return true;
  }

  static #isIPAddress(hostname) {
    return net.isIP(hostname) > 0;
  }

  static #isPrivateIP(ip) {
    // IPv4 private ranges
    const privateRanges = [
      /^10\./,
      /^127\./,
      /^169\.254\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
    ];

    if (net.isIP(ip) === 4) {
      return privateRanges.some((regex) => regex.test(ip));
    }

    // IPv6 private ranges
    if (net.isIP(ip) === 6) {
      return ip.startsWith('fc') || ip.startsWith('fd') || ip === '::1';
    }

    return false;
  }

  static async #dnsLookupWithTimeout(hostname, timeout) {
    return Promise.race([
      dns.lookup(hostname),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DNS lookup timeout')), timeout)
      ),
    ]);
  }

  /**
   * Quick synchronous validation (without DNS)
   */
  static validateSync(url, allowedDomains = [], options = {}) {
    const config = { ...this.DEFAULT_OPTIONS, ...options };

    if (!this.#basicValidation(url, config)) return false;

    const parsed = this.#parseURL(url);
    if (!parsed) return false;

    if (!this.#protocolCheck(parsed, config)) return false;
    if (!this.#portCheck(parsed, config)) return false;
    if (!this.#pathTraversalCheck(parsed)) return false;

    if (allowedDomains.length > 0 && !allowedDomains.includes(parsed.hostname)) return false;
    if (!config.allowIPs && net.isIP(parsed.hostname)) return false;

    return true;
  }
}
