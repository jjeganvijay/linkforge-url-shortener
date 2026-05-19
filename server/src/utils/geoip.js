let geoip;
try {
  geoip = require('geoip-lite');
} catch {
  geoip = null;
}

const getCountryFromIp = (ip) => {
  if (!ip || !geoip) return 'Unknown';
  const clean = String(ip).replace('::ffff:', '').split(',')[0].trim();
  if (clean === '127.0.0.1' || clean.startsWith('192.168.') || clean === '::1') {
    return 'Local';
  }
  const lookup = geoip.lookup(clean);
  return lookup?.country || 'Unknown';
};

module.exports = { getCountryFromIp };
