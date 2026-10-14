import { useState, useEffect } from 'react';
import { Review, ReviewStats } from '../types/review';
import { INITIAL_REVIEWS } from '../data/reviews';

const STORAGE_KEY = 'coffeeland_reviews_v2';

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading reviews from localStorage:', e);
    }
    return INITIAL_REVIEWS;
  });

  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error('Error saving reviews to localStorage:', e);
    }
  }, [reviews]);

  /**
   * Submit a new customer review with photos uploaded from phone or device
   */
  const addReview = (newReviewData: {
    author: string;
    rating: number;
    comment: string;
    dishName?: string;
    photos: string[];
    deviceType?: 'Mobile Phone' | 'iPhone' | 'Android' | 'Tablet' | 'Desktop';
    location?: string;
  }) => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const newReview: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      author: newReviewData.author.trim() || 'Happy Guest',
      rating: Math.max(1, Math.min(5, newReviewData.rating)),
      date: formattedDate,
      relativeTime: 'Just now',
      comment: newReviewData.comment.trim(),
      dishName: newReviewData.dishName || 'Artisanal Cafe Special',
      photos: newReviewData.photos || [],
      isVerified: true,
      deviceType: newReviewData.deviceType || (window.innerWidth < 768 ? 'Mobile Phone' : 'Desktop'),
      location: newReviewData.location || 'Coffee Land Resto & Cafe Guest',
      likes: 0,
      userLiked: false,
    };

    setReviews((prev) => [newReview, ...prev]);
    return newReview;
  };

  /**
   * Toggle like for a review
   */
  const toggleLikeReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const userLiked = !r.userLiked;
          return {
            ...r,
            userLiked,
            likes: userLiked ? r.likes + 1 : Math.max(0, r.likes - 1),
          };
        }
        return r;
      })
    );
  };

  /**
   * Compute aggregated statistics
   */
  const stats: ReviewStats = {
    averageRating: reviews.length
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
      : 5.0,
    totalReviews: reviews.length,
    totalPhotos: reviews.reduce((acc, r) => acc + (r.photos?.length || 0), 0),
    ratingsBreakdown: reviews.reduce(
      (acc, r) => {
        const score = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
        if (acc[score] !== undefined) {
          acc[score] += 1;
        }
        return acc;
      },
      { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    ),
  };

  return {
    reviews,
    addReview,
    toggleLikeReview,
    stats,
    activePhotoModal,
    setActivePhotoModal,
  };
};
