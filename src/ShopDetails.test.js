import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShopDetails from './ShopDetails';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Mock Firebase
jest.mock('firebase/firestore');
jest.mock('firebase/auth');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockDoc = doc;
const mockSetDoc = setDoc;
const mockGetDoc = getDoc;
const mockOnAuthStateChanged = onAuthStateChanged;

describe('ShopDetails Add To Cart Functionality', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    jest.clearAllMocks();
  });

  test('redirects to login if user is not authenticated', async () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });

    render(<ShopDetails />);

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('adds new item to cart for authenticated user', async () => {
    const mockUser = { uid: 'user123' };
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });

    mockGetDoc.mockResolvedValue({
      exists: () => false,
      data: () => ({}),
    });

    mockSetDoc.mockResolvedValue();

    render(<ShopDetails />);

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(mockGetDoc).toHaveBeenCalledWith(mockDoc({}, 'carts', 'user123'));
      expect(mockSetDoc).toHaveBeenCalledWith(mockDoc({}, 'carts', 'user123'), {
        items: [{
          id: 1,
          title: "The latest iPhone 15 Pro Max with Blue Solid Color 256GB",
          price: 1340,
          qty: 1,
          image: "assets/img/shop/shop_details-img01.jpg",
        }],
      });
      expect(window.alert).toHaveBeenCalledWith('Product added to cart!');
    });
  });

  test('updates quantity for existing item in cart', async () => {
    const mockUser = { uid: 'user123' };
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });

    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        items: [{
          id: 1,
          title: "The latest iPhone 15 Pro Max with Blue Solid Color 256GB",
          price: 1340,
          qty: 2,
          image: "assets/img/shop/shop_details-img01.jpg",
        }],
      }),
    });

    mockSetDoc.mockResolvedValue();

    render(<ShopDetails />);

    // Increase qty to 2
    const increaseButton = screen.getByRole('button', { name: /increase quantity/i });
    fireEvent.click(increaseButton);

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(mockSetDoc).toHaveBeenCalledWith(mockDoc({}, 'carts', 'user123'), {
        items: [{
          id: 1,
          title: "The latest iPhone 15 Pro Max with Blue Solid Color 256GB",
          price: 1340,
          qty: 4, // 2 + 2
          image: "assets/img/shop/shop_details-img01.jpg",
        }],
      });
      expect(window.alert).toHaveBeenCalledWith('Product added to cart!');
    });
  });

  test('handles Firestore error gracefully', async () => {
    const mockUser = { uid: 'user123' };
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });

    mockGetDoc.mockRejectedValue(new Error('Firestore error'));

    render(<ShopDetails />);

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to add to cart.');
    });
  });

  test('handles multiple adds correctly', async () => {
    const mockUser = { uid: 'user123' };
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });

    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        items: [{
          id: 1,
          title: "The latest iPhone 15 Pro Max with Blue Solid Color 256GB",
          price: 1340,
          qty: 1,
          image: "assets/img/shop/shop_details-img01.jpg",
        }],
      }),
    });

    mockSetDoc.mockResolvedValue();

    render(<ShopDetails />);

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });

    // First add
    fireEvent.click(addToCartButton);
    await waitFor(() => {
      expect(mockSetDoc).toHaveBeenCalledWith(mockDoc({}, 'carts', 'user123'), {
        items: [{
          id: 1,
          title: "The latest iPhone 15 Pro Max with Blue Solid Color 256GB",
          price: 1340,
          qty: 2,
          image: "assets/img/shop/shop_details-img01.jpg",
        }],
      });
    });

    // Second add
    fireEvent.click(addToCartButton);
    await waitFor(() => {
      expect(mockSetDoc).toHaveBeenCalledWith(mockDoc({}, 'carts', 'user123'), {
        items: [{
          id: 1,
          title: "The latest iPhone 15 Pro Max with Blue Solid Color 256GB",
          price: 1340,
          qty: 3,
          image: "assets/img/shop/shop_details-img01.jpg",
        }],
      });
    });
  });
});
