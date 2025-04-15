import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GalleryScreen from '@/app/store/[id]/gallery';
import { useStoreImageCollections } from '@/lib/api/hooks/useStoreImages';
import { getStoreById } from '@/lib/api/services/searchService';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
  useLocalSearchParams: () => ({
    id: '123',
    initialIndex: '0',
  }),
}));

// Mock getImageUrl helper
jest.mock('@/lib/helpers', () => ({
  getImageUrl: (path: string) => path || 'https://picsum.photos/300',
}));

// Mock the hooks
jest.mock('@/lib/api/hooks/useStoreImages', () => ({
  useStoreImageCollections: jest.fn(),
  flattenStoreImageCollections: (data: any) => {
    if (!data || !data.data || !data.data.storeImagesCollections) {
      return [];
    }
    return data.data.storeImagesCollections;
  },
}));

// Mock the API service
jest.mock('@/lib/api/services/searchService', () => ({
  getStoreById: jest.fn(),
}));

describe('GalleryScreen', () => {
  const mockStore = {
    _id: '123',
    name: 'Test Store',
    mainImage: 'main.jpg',
    coverImage: 'cover.jpg',
    allImages: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
  };

  const mockImageCollections = {
    data: {
      storeImagesCollections: [
        {
          _id: 'col1',
          heading: 'Ambience',
          images: ['ambience1.jpg', 'ambience2.jpg'],
        },
        {
          _id: 'col2',
          heading: 'Food',
          images: ['food1.jpg', 'food2.jpg'],
        },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the API responses
    (getStoreById as jest.Mock).mockResolvedValue(mockStore);
    (useStoreImageCollections as jest.Mock).mockReturnValue({
      data: mockImageCollections,
      isLoading: false,
    });
  });

  it('renders loading state initially', async () => {
    (useStoreImageCollections as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
    });

    const { getByText } = render(<GalleryScreen />);
    
    expect(getByText('Loading gallery...')).toBeTruthy();
  });

  it('renders gallery with tabs and images', async () => {
    const { getByText, getAllByRole } = render(<GalleryScreen />);
    
    // Wait for data to load
    await waitFor(() => {
      // Check if tabs are rendered
      expect(getByText('All')).toBeTruthy();
      expect(getByText('Ambience')).toBeTruthy();
      expect(getByText('Food')).toBeTruthy();
    });
  });

  it('changes tab when a tab is pressed', async () => {
    const { getByText } = render(<GalleryScreen />);
    
    // Wait for data to load
    await waitFor(() => {
      // Press the Ambience tab
      fireEvent.press(getByText('Ambience'));
      
      // Check if the tab is active
      const ambienceTab = getByText('Ambience').parent;
      expect(ambienceTab?.props.style).toContainEqual(
        expect.objectContaining({ backgroundColor: '#8A3FFC' })
      );
    });
  });
});
