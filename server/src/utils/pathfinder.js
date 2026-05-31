const fetch = require('node-fetch');

async function getRealDistanceKm(lat1, lng1, lat2, lng2) {
  try {
    // OSRM menggunakan format Longitude, Latitude
    const url = `http://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=false`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const distanceKm = data.routes[0].distance / 1000;
      return Math.round(distanceKm * 10) / 10;
    }
    return null;
  } catch (error) {
    console.error('❌ Pathfinding Error:', error.message);
    return null;
  }
}

module.exports = getRealDistanceKm;