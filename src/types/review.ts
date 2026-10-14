export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number; // 1 to 5
  date: string;
  relativeTime: string;
  comment: string;
  dishName?: string;
  photos: string[]; // Base64 or image URLs
  isVerified: boolean;
  deviceType?: 'Mobile Phone' | 'iPhone' | 'Android' | 'Tablet' | 'Desktop';
  location?: string;
  likes: number;
  userLiked?: boolean;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  totalPhotos: number;
  ratingsBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
