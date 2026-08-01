import { COIMBATORE_NGOS } from '../data/coimbatoreData';

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Rounded to 1 decimal place
};

/**
 * Smart NGO Matcher based on travel duration, food shelf life availability, and NGO capacity
 */
export const findOptimalNgoForPickup = (donation) => {
  const pickupLat = donation.lat || donation.pickup_lat || 11.0168;
  const pickupLng = donation.lng || donation.pickup_lng || 76.9558;
  const expiryHours = Number(donation.expiry_hours) || 4;
  const quantityKg = Number(donation.quantity_kg) || 20;

  const scoredNgos = COIMBATORE_NGOS.map((ngo) => {
    const distKm = calculateDistanceKm(pickupLat, pickupLng, ngo.lat, ngo.lng);
    // Estimated travel duration in minutes (avg 25-30 km/h urban traffic speed + 5 min buffer)
    const travelDurationMins = Math.max(5, Math.round((distKm / 25) * 60 + 5));

    // Urgency & Shelf Life Score: More urgent if food expires soon
    const shelfLifeUrgencyScore = expiryHours <= 3 ? 40 : 20;

    // Proximity Score (closer is better, max 40 points)
    const proximityScore = Math.max(0, 40 - distKm * 3);

    // NGO Need / Priority Score
    const needScore = ngo.status === 'Urgent Needs' ? 20 : 10;

    const totalMatchScore = Math.min(99, Math.round(shelfLifeUrgencyScore + proximityScore + needScore));

    return {
      ...ngo,
      distanceKm: distKm,
      travelDurationMins,
      matchScore: totalMatchScore
    };
  });

  // Sort by highest match score first, then by shortest travel duration
  scoredNgos.sort((a, b) => b.matchScore - a.matchScore || a.travelDurationMins - b.travelDurationMins);

  const topMatch = scoredNgos[0];

  return {
    matchedNgo: topMatch,
    allCandidates: scoredNgos,
    routeDetails: {
      pickupBusStop: donation.bus_stop_name || 'Nearest Coimbatore Bus Stop',
      destinationNgo: topMatch.name,
      ngoArea: topMatch.area,
      distanceKm: topMatch.distanceKm,
      travelDurationMins: topMatch.travelDurationMins,
      foodExpiryHours: expiryHours,
      estimatedMeals: Math.round(quantityKg * 3),
      matchConfidence: `${topMatch.matchScore}%`,
      recommendationReason: `Optimal match: ${topMatch.distanceKm} km away (${topMatch.travelDurationMins} mins travel duration) via ${donation.bus_stop_name || 'local hub'}. NGO has active capacity for ${topMatch.dailyCapacity}.`
    }
  };
};
