import { SearchItem } from "@/stores/useSearchStore";

// Mock data for stores and products
const mockStores: SearchItem[] = [
  { id: '1', name: 'Seefah', category: 'Restaurant', imageUrl: '' },
  { id: '2', name: 'The Green Table', category: 'Restaurant', imageUrl: '' },
  { id: '3', name: 'Bloopers', category: 'Fashion', imageUrl: '' },
  { id: '4', name: 'Jolochip', category: 'Healthy snacks', imageUrl: '' },
  { id: '5', name: 'Urban Outfitters', category: 'Fashion', imageUrl: '' },
  { id: '6', name: 'Spice Garden', category: 'Restaurant', imageUrl: '' },
  { id: '7', name: 'Tech Haven', category: 'Electronics', imageUrl: '' },
  { id: '8', name: 'Fitness First', category: 'Sports & Fitness', imageUrl: '' },
  { id: '9', name: 'Beauty Bar', category: 'Cosmetics', imageUrl: '' },
  { id: '10', name: 'Home Essentials', category: 'Home Decor', imageUrl: '' },
];

const mockProducts: SearchItem[] = [
  { id: 'p1', name: 'Pad Thai', category: 'Food', imageUrl: '' },
  { id: 'p2', name: 'Green Curry', category: 'Food', imageUrl: '' },
  { id: 'p3', name: 'Blue Jeans', category: 'Clothing', imageUrl: '' },
  { id: 'p4', name: 'Tortilla Chips', category: 'Snacks', imageUrl: '' },
  { id: 'p5', name: 'Smartphone', category: 'Electronics', imageUrl: '' },
  { id: 'p6', name: 'Yoga Mat', category: 'Fitness', imageUrl: '' },
  { id: 'p7', name: 'Lipstick', category: 'Makeup', imageUrl: '' },
  { id: 'p8', name: 'Throw Pillow', category: 'Home Decor', imageUrl: '' },
  { id: 'p9', name: 'Running Shoes', category: 'Footwear', imageUrl: '' },
  { id: 'p10', name: 'Coffee Maker', category: 'Appliances', imageUrl: '' },
];

// Combine all items for search
const allItems = [...mockStores, ...mockProducts];

/**
 * Search for items based on query
 * @param query Search query
 * @returns Promise with search results
 */
export const searchItems = async (query: string): Promise<SearchItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!query.trim()) {
    return [];
  }
  
  // Filter items based on query
  const lowerQuery = query.toLowerCase();
  return allItems.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) || 
    item.category.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get popular stores
 * @returns Promise with popular stores
 */
export const getPopularStores = async (): Promise<SearchItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return first 4 stores as popular
  return mockStores.slice(0, 4);
};
