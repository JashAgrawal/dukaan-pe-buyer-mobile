import React from 'react';
import { render } from '@testing-library/react-native';
import StoreHero from '../components/store/StoreHero';

// Mock the router
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}));

describe('StoreHero', () => {
  it('renders correctly with all props', () => {
    const props = {
      id: '123',
      name: 'Seefah',
      imageUrl: 'https://example.com/image.jpg',
      logoUrl: 'https://example.com/logo.jpg',
      categories: ['Thai', 'Japanese', 'Seafood'],
      rating: 7.5,
      location: 'JVPD Scheme, Juhu',
      costForOne: 250,
      openingHours: '11:30am - 1:30pm, 2:30pm - 4:30pm',
      isOpen: true,
      recommendationCount: 280,
      recommendedBy: 'Bhagyalaxmi',
      isFavorite: false,
      onToggleFavorite: jest.fn(),
    };

    const { toJSON } = render(<StoreHero {...props} />);
    expect(toJSON()).toBeTruthy();
  });
});
