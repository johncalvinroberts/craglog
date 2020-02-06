function calculateGeoDistance([lat, lng], [lat2, lng2]) {
  const earthRadius = 6371; // Radius of the earth in km
  const dLat = degreeToRadius(lat2 - lat); // deg2rad below
  const dLng = degreeToRadius(lng2 - lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreeToRadius(lat)) *
      Math.cos(degreeToRadius(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c; // Distance in km
  return distance;
}

function degreeToRadius(deg) {
  return deg * (Math.PI / 180);
}
export default calculateGeoDistance;
