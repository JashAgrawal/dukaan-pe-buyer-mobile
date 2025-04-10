import { Store } from '../types/store';
import { StoreCardData } from '../types/storeCard';

/**
 * Converts a Store object to StoreCardData format for display in UI
 */
export const storeToCardData = (store: Store, distance?: string): StoreCardData => {
  return {
    id: store._id,
    imageUrl: store.coverImage || store.logo,
    name: store.name,
    type: store.categories?.[0] || 'Store',
    location: `${store.address.city}, ${store.address.state}`,
    distance: distance || 'Unknown distance',
    rating: store.rating,
    // These would come from a loyalty program system
    loyaltyBenefit: store.isVerified ? 'Loyalty Benefits' : undefined,
    rewardText: store.isVerified ? 'Get 💰 20 for every recommendation' : undefined,
  };
};

/**
 * Calculate distance between user location and store
 * This is a placeholder - actual implementation would use geolocation
 */
export const calculateDistance = (
  userLat: number, 
  userLng: number, 
  storeLat: number, 
  storeLng: number
): string => {
  // Simple Haversine formula implementation
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(storeLat - userLat);
  const dLon = deg2rad(storeLng - userLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(userLat)) * Math.cos(deg2rad(storeLat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  
  return `${distance.toFixed(1)} km`;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};
