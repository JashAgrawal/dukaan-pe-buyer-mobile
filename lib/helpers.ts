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

const getDistanceBetween2Coordinates = (
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
