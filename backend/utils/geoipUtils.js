import geoip from 'fast-geoip';

/**
 * Extract real client IP from request
 * Handles proxies like Render, Heroku, Cloudflare, etc.
 * @param {object} req - Express request object
 * @returns {string} Client IP address
 */
export const getClientIp = (req) => {
    // Priority order for IP extraction:
    // 1. CF-Connecting-IP (Cloudflare)
    // 2. X-Real-IP (Nginx)
    // 3. X-Forwarded-For (first IP in chain)
    // 4. req.ip (Express with trust proxy)
    // 5. req.socket.remoteAddress (direct connection)
    
    const cfIp = req.headers['cf-connecting-ip'];
    if (cfIp) return cfIp;
    
    const realIp = req.headers['x-real-ip'];
    if (realIp) return realIp;
    
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
        // X-Forwarded-For can contain multiple IPs: "client, proxy1, proxy2"
        // The first one is the real client IP
        const firstIp = forwardedFor.split(',')[0].trim();
        if (firstIp) return firstIp;
    }
    
    // Fallback to Express req.ip (requires trust proxy)
    if (req.ip) return req.ip;
    
    // Last resort: direct socket connection
    return req.socket?.remoteAddress || 'Unknown';
};

/**
 * Check if IP is private/local
 * @param {string} ip - IP address to check
 * @returns {boolean}
 */
const isPrivateIp = (ip) => {
    if (!ip || ip === 'Unknown') return true;
    
    // Clean IPv6-mapped IPv4
    const cleanIp = ip.replace(/^::ffff:/, '');
    
    return (
        cleanIp === '::1' ||
        cleanIp === 'localhost' ||
        cleanIp.startsWith('127.') ||
        cleanIp.startsWith('192.168.') ||
        cleanIp.startsWith('10.') ||
        cleanIp.startsWith('172.16.') ||
        cleanIp.startsWith('172.17.') ||
        cleanIp.startsWith('172.18.') ||
        cleanIp.startsWith('172.19.') ||
        cleanIp.startsWith('172.2') ||
        cleanIp.startsWith('172.30.') ||
        cleanIp.startsWith('172.31.')
    );
};

/**
 * Get geolocation data from IP address
 * @param {string} ipAddress - IP address to lookup
 * @returns {object} Geolocation data or null
 */
export const getGeolocation = (ipAddress) => {
    try {
        console.log('🌍 Geolocation lookup for IP:', ipAddress);

        // Handle localhost/private IPs
        if (isPrivateIp(ipAddress)) {
            console.log('📍 Detected local/private IP, returning Local');
            return {
                country: 'Local',
                region: 'Local',
                city: 'Local',
                timezone: null
            };
        }

        // Clean IPv6-mapped IPv4 addresses (::ffff:192.168.1.1 -> 192.168.1.1)
        const cleanIp = ipAddress.replace(/^::ffff:/, '');
        console.log('🔍 Looking up cleaned IP:', cleanIp);

        const geo = geoip.lookup(cleanIp);

        if (!geo) {
            console.log('❌ No geolocation data found for IP:', cleanIp);
            return {
                country: 'Unknown',
                region: 'Unknown',
                city: 'Unknown',
                timezone: null
            };
        }

        console.log('✅ Geolocation found:', geo.country, geo.city);
        return {
            country: geo.country || 'Unknown',
            region: geo.region || 'Unknown',
            city: geo.city || 'Unknown',
            timezone: geo.timezone || null
        };
    } catch (error) {
        console.error('Geolocation lookup error:', error.message);
        return {
            country: 'Unknown',
            region: 'Unknown',
            city: 'Unknown',
            timezone: null
        };
    }
};
