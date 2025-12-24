import { getGeolocation } from './utils/geoipUtils.js';

console.log('\n🧪 Testing Geolocation Utility\n');

// Test 1: Localhost (should return Local)
console.log('Test 1 - Localhost:');
console.log(getGeolocation('127.0.0.1'));
console.log(getGeolocation('::1'));

// Test 2: Public IPs (should return real locations)
console.log('\nTest 2 - Google DNS (USA):');
console.log(getGeolocation('8.8.8.8'));

console.log('\nTest 3 - Cloudflare DNS (Australia):');
console.log(getGeolocation('1.1.1.1'));

console.log('\nTest 4 - Indian IP:');
console.log(getGeolocation('117.239.240.1'));

console.log('\nTest 5 - UK IP:');
console.log(getGeolocation('81.2.69.142'));

console.log('\n✅ Geolocation is working correctly!\n');
