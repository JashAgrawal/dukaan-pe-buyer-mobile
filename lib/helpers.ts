/**
 * Helper functions for the application
 */

/**
 * Get the full URL for an image
 * @param path Image path or URL
 * @returns Full URL for the image
 */
export const getImageUrl = (path?: string): string => {
  if (!path) {
    return "https://picsum.photos/300";
  }

  // If it's already a full URL, return it
  if (path.startsWith("http")) {
    return path;
  }

  // Otherwise, prepend the API base URL
  // In a real app, this would be your API's media URL
  return `${process.env.EXPO_PUBLIC_API_URL}${path}`;
};

/**
 * Format currency
 * @param amount Amount to format
 * @param currency Currency code (default: INR)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency = "INR"): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date
 * @param date Date to format
 * @param format Format to use (default: 'medium')
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date,
  format: "short" | "medium" | "long" = "medium"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: format === "short" ? "short" : "long",
    day: "numeric",
  };

  if (format === "long") {
    options.hour = "numeric";
    options.minute = "numeric";
  }

  return new Intl.DateTimeFormat("en-IN", options).format(dateObj);
};

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of first coordinate
 * @param lon1 Longitude of first coordinate
 * @param lat2 Latitude of second coordinate
 * @param lon2 Longitude of second coordinate
 * @returns Distance in kilometers
 */
export const getDistanceBetween2Coordinates = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

/**
 * Calculate the distance between a store and user location
 * @param storeCoordinates Store coordinates [longitude, latitude]
 * @param userCoordinates User coordinates [longitude, latitude]
 * @returns Distance in kilometers
 */
export const calculateStoreDistance = (
  storeCoordinates: [number, number],
  userCoordinates: [number, number]
): number => {
  // Extract coordinates (note: coordinates are stored as [longitude, latitude])
  const [storeLon, storeLat] = storeCoordinates;
  const [userLon, userLat] = userCoordinates;

  // Calculate distance using Haversine formula
  return getDistanceBetween2Coordinates(userLat, userLon, storeLat, storeLon);
};

/**
 * Estimate travel time based on distance and transportation mode
 * @param distanceInKm Distance in kilometers
 * @param mode Transportation mode (walking, cycling, driving)
 * @returns Estimated travel time in minutes
 */
export const estimateTravelTime = (
  distanceInKm: number,
  mode: "walking" | "cycling" | "driving" = "driving"
): number => {
  // Average speeds in km/h for different transportation modes
  const speeds = {
    walking: 5, // Average walking speed: 5 km/h
    cycling: 15, // Average cycling speed: 15 km/h
    driving: 30, // Average urban driving speed: 30 km/h
  };

  // Calculate time in hours
  const timeInHours = distanceInKm / speeds[mode];

  // Convert to minutes and round
  return Math.round(timeInHours * 60);
};

/**
 * Format distance for display
 * @param distanceInKm Distance in kilometers
 * @returns Formatted distance string
 */
export const formatDistance = (distanceInKm: number): string => {
  if (distanceInKm < 0.1) {
    // Convert to meters for very short distances
    const meters = Math.round(distanceInKm * 1000);
    return `${meters} m`;
  } else if (distanceInKm < 10) {
    // Show one decimal place for distances under 10 km
    return `${distanceInKm.toFixed(1)} km`;
  } else {
    // Round to nearest km for longer distances
    return `${Math.round(distanceInKm)} km`;
  }
};

/**
 * Format travel time for display
 * @param timeInMinutes Time in minutes
 * @returns Formatted time string
 */
export const formatTravelTime = (timeInMinutes: number): string => {
  if (timeInMinutes < 1) {
    return "Less than a minute";
  } else if (timeInMinutes < 60) {
    return `${timeInMinutes} min`;
  } else {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;

    if (minutes === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${minutes} min`;
    }
  }
};

/**
 * Get distance and estimated travel time between store and user
 * @param storeCoordinates Store coordinates [longitude, latitude]
 * @param userCoordinates User coordinates [longitude, latitude]
 * @param mode Transportation mode
 * @returns Object with distance and travel time information
 */
export const getStoreDistanceAndTime = (
  storeCoordinates: [number, number],
  userCoordinates: [number, number],
  mode: "walking" | "cycling" | "driving" = "driving"
): {
  distance: number;
  formattedDistance: string;
  travelTimeMinutes: number;
  formattedTravelTime: string;
} => {
  // Calculate distance
  const distance = calculateStoreDistance(storeCoordinates, userCoordinates);

  // Estimate travel time
  const travelTimeMinutes = estimateTravelTime(distance, mode);

  return {
    distance,
    formattedDistance: formatDistance(distance),
    travelTimeMinutes,
    formattedTravelTime: formatTravelTime(travelTimeMinutes),
  };
};
