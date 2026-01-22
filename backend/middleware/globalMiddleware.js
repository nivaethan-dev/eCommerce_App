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
        timezone: "N/A",
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

        const fetchWithTimeout = async (url) => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (response.ok) return await response.json();
            } catch (e) { }
            return null;
        };

        // Attempt 1: freeipapi.com (High reliability)
        let data = await fetchWithTimeout(`https://freeipapi.com/api/json/${ip}`);
        if (data && (data.cityName || data.city)) {
            req.clientInfo = {
                ...req.clientInfo,
                country: data.countryName || req.clientInfo.country,
                city: data.cityName || data.city || "Unknown",
                region: data.regionName || data.region || "Unknown",
                timezone: data.timeZone || data.timezone || "N/A",
                detailed: true
            };
            return req.clientInfo;
        }

        // Attempt 2: ip-api.com (Tertiary - very reliable)
        data = await fetchWithTimeout(`http://ip-api.com/json/${ip}`);
        if (data && data.status === 'success') {
            req.clientInfo = {
                ...req.clientInfo,
                country: data.country || req.clientInfo.country,
                city: data.city || "Unknown",
                region: data.regionName || data.region || "Unknown",
                timezone: data.timezone || "N/A",
                isp: data.isp || "Unknown",
                detailed: true
            };
            return req.clientInfo;
        }

        // Attempt 3: ipapi.co (Fallback)
        data = await fetchWithTimeout(`https://ipapi.co/${ip}/json/`);
        if (data && !data.error) {
            req.clientInfo = {
                ...req.clientInfo,
                country: data.country_name || req.clientInfo.country,
                city: data.city || "Unknown",
                region: data.region || "Unknown",
                timezone: data.timezone || data.timeZone || "N/A",
                isp: data.org || "Unknown",
                detailed: true
            };
            return req.clientInfo;
        }

        // Final fallback: Mark as detailed to prevent retry loops
        req.clientInfo.detailed = true;
        return req.clientInfo;
    };

    /**
     * 5. Manual Populate for API Routes (Removed auto-populate to save rate limits)
     * Controllers will now call req.getDetailedGeo() only for critical events.
     */

    next();
};
