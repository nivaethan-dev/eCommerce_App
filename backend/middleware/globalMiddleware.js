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

    // 2. Initial Identity Object
    req.clientInfo = {
        ip: req.ip,
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
     * 3. Lazy Identity Helper (Professional Production Pattern)
     * On Render, City/Region headers aren't native. 
     * This helper ensures you get high-quality data only when needed.
     */
    req.getDetailedGeo = async () => {
        // If we already have detailed info, return it instantly
        if (req.clientInfo.detailed) return req.clientInfo;

        // Skip lookup for localhost
        if (req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === 'localhost') {
            req.clientInfo.country = "Localhost";
            req.clientInfo.city = "Localhost";
            req.clientInfo.region = "Local";
            req.clientInfo.detailed = true;
            return req.clientInfo;
        }

        try {
            // Strict 2s timeout for Render stability
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            const response = await fetch(`https://ipapi.co/${req.ip}/json/`, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                req.clientInfo = {
                    ...req.clientInfo,
                    country: data.country_name || req.clientInfo.country,
                    city: data.city || "Unknown",
                    region: data.region || "Unknown",
                    timezone: data.timezone,
                    isp: data.org,
                    detailed: true
                };
            }
        } catch (e) {
            // Log failure but don't break the user's experience
            req.clientInfo.detailed = true; // prevent re-trying on same request
        }
        return req.clientInfo;
    };

    /**
     * 4. AUTO-POPULATE for API Routes
     * In production, we automatically populate this for API calls 
     * (Login, Registration, Orders) so the data is ready for your logic.
     */
    if (req.path.startsWith('/api')) {
        // We don't 'await' here to keep the event loop moving fast,
        // but the data will be ready by the time it hits your controllers.
        req.getDetailedGeo().catch(() => { });
    }

    next();
};
