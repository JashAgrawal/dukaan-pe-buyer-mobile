import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StoreGallery from '@/components/store/StoreGallery';
import { router } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock getImageUrl helper
jest.mock('@/lib/helpers', () => ({
  getImageUrl: (path: string) => path || 'https://picsum.photos/300',
}));

describe('StoreGallery', () => {
  const mockImages = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
    'image4.jpg',
    'image5.jpg',
    'image6.jpg',
  ];

  it('renders correctly with images', () => {
    const { getByText, getAllByRole } = render(
      <StoreGallery storeId="123" images={mockImages} />
    );

    // Check if gallery title is rendered
    expect(getByText('Gallery')).toBeTruthy();
    
    // Check if "See all photos" is rendered when there are more than 5 images
    expect(getByText('See all photos')).toBeTruthy();
    
    // Check if images are rendered
    const images = getAllByRole('image');
    expect(images.length).toBe(5); // Should show 5 images max
  });

  it('does not render when no images are provided', () => {
    const { container } = render(<StoreGallery storeId="123" images={[]} />);
    expect(container.children.length).toBe(0);
  });

  it('navigates to gallery page when an image is pressed', () => {
    const { getAllByRole } = render(
      <StoreGallery storeId="123" images={mockImages} />
    );

    // Press the first image
    const images = getAllByRole('image');
    fireEvent.press(images[0]);

    // Check if router.push was called with correct params
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/store/123/gallery',
      params: { initialIndex: 0 },
    });
  });

  it('calls onSeeAllPress when "See all photos" is pressed', () => {
    const mockOnSeeAllPress = jest.fn();
    const { getByText } = render(
      <StoreGallery 
        storeId="123" 
        images={mockImages} 
        onSeeAllPress={mockOnSeeAllPress} 
      />
    );

    // Press "See all photos"
    fireEvent.press(getByText('See all photos'));

    // Check if onSeeAllPress was called
    expect(mockOnSeeAllPress).toHaveBeenCalled();
  });
});
