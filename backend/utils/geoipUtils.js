import geoip from 'geoip-lite';

/**
 * Get geolocation data from IP address
 * @param {string} ipAddress - IP address to lookup
 * @returns {object} Geolocation data or null
 */
export const getGeolocation = (ipAddress) => {
    try {
        console.log('🌍 Geolocation lookup for IP:', ipAddress);

        // Handle localhost/private IPs
        if (!ipAddress || ipAddress === 'Unknown' || ipAddress === '::1' || ipAddress.startsWith('127.') || ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.')) {
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
            console.log('❌ No geolocation data found for IP');
            return {
                country: 'Unknown',
                region: 'Unknown',
                city: 'Unknown',
                timezone: null
            };
        }

        console.log('✅ Geolocation found:', geo);
        return {
            country: geo.country || 'Unknown',
            region: geo.region || 'Unknown',
            city: geo.city || 'Unknown',
            timezone: geo.timezone || null
        };
    } catch (error) {
        console.error('Geolocation lookup error:', error);
        return {
            country: 'Unknown',
            region: 'Unknown',
            city: 'Unknown',
            timezone: null
        };
    }
};
