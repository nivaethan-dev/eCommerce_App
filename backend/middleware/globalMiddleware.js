import crypto from 'crypto';

/**
 * Global Production Middleware - Optimized for Render
 * 
 * Provides: 
 * 1. Request Tracing (Request-ID)
 * 2. Real IP Detection (via trust proxy)
 * 3. Verified Geo-Location (Country, City, Region)
 */
export const globalMiddleware = (req, res, next) => {
    // 1. Assign Request ID for production tracing
    req.id = req.headers['x-request-id'] || crypto.randomUUID();
    res.setHeader('X-Request-ID', req.id);
    req.startTime = Date.now();

    // 2. Resolve Real IP (Render/Cloudflare Specific)
    // We prioritize X-Forwarded-For because Render's load balancer provides it.
    // Express req.ip can sometimes capture the internal cluster IP if trust proxy is misconfigured.
    const forwardedHeader = req.headers['x-forwarded-for'];
    const realIp = forwardedHeader ? forwardedHeader.split(',')[0].trim() : req.ip;

    // 3. Initial Identity Object
    req.clientInfo = {
        ip: realIp,
        id: req.id,
        method: req.method,
        path: req.path,
        userAgent: req.headers['user-agent'],
        // Check for common infra headers first (Cloudflare/CDN)
        country: req.headers['cf-ipcountry'] || req.headers['x-appengine-country'] || "Unknown",
        city: req.headers['x-geoip-city'] || "Unknown",
        region: req.headers['x-geoip-region'] || "Unknown",
        detailed: false
    };

    /**
     * Helper to check for private/local IPs
     */
    const isInternalIp = (ip) => {
        if (!ip) return true;
        return ip === '127.0.0.1' || ip === '::1' || ip.startsWith('10.') || ip.startsWith('192.168.') ||
            (ip.startsWith('172.') && parseInt(ip.split('.')[1]) >= 16 && parseInt(ip.split('.')[1]) <= 31);
    };

    /**
     * 4. Lazy Identity Helper
     */
    req.getDetailedGeo = async () => {
        if (req.clientInfo.detailed) return req.clientInfo;

        const ip = req.clientInfo.ip;

        // Skip lookup for internal/local IPs
        if (isInternalIp(ip)) {
            req.clientInfo.country = req.clientInfo.country !== "Unknown" ? req.clientInfo.country : "Internal";
            req.clientInfo.city = "Internal Network";
            req.clientInfo.region = "Internal";
            req.clientInfo.detailed = true;
            return req.clientInfo;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            // Fetch from ipapi.co (Free tier)
            const response = await fetch(`https://ipapi.co/${ip}/json/`, {
                signal: controller.signal,
                headers: { 'User-Agent': 'CloudCart-App' } // Good practice for API stability
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();

                // Only update if we got valid data back (prevents overwriting infra headers with error messages)
                if (!data.error) {
                    req.clientInfo = {
                        ...req.clientInfo,
                        country: data.country_name || req.clientInfo.country,
                        city: data.city || req.clientInfo.city,
                        region: data.region || req.clientInfo.region,
                        timezone: data.timezone || "N/A",
                        isp: data.org || "Unknown",
                        detailed: true
                    };
                }
            }
        } catch (e) {
            // Silently fail detailed lookup to keep request alive
            req.clientInfo.detailed = true;
        }
        return req.clientInfo;
    };

    /**
     * 5. Manual Populate for API Routes (Removed auto-populate to save rate limits)
     * Controllers will now call req.getDetailedGeo() only for critical events.
     */

    next();
};
