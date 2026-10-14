import { Review } from '../types/review';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    date: '2026-10-12',
    relativeTime: 'Yesterday',
    comment: 'The Lotus Biscoff Kunafa was out of this world! Super crispy kataifi pastry on the outside, stretchy warm cheese inside, and drenched in warm Biscoff spread. Also loved the aesthetic ambient lighting in the evening. Shot these pics from my phone right at table 4!',
    dishName: 'Lotus Biscoff Kunafa',
    photos: [
      '/menu-assets/img_p1_0.png',
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop'
    ],
    isVerified: true,
    deviceType: 'iPhone',
    location: 'Bangalore / Chikmagalur',
    likes: 42,
    userLiked: false,
  },
  {
    id: 'rev-2',
    author: 'Priya Mukherjee',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    date: '2026-10-10',
    relativeTime: '3 days ago',
    comment: 'Best cappuccino and sizzling chocolate brownie in town! The aroma when you step into Coffee Land is unmatched. The barista latte art was so gorgeous I had to snap several photos before taking a sip. Definitely coming back every weekend!',
    dishName: 'Cappuccino & Sizzling Brownie',
    photos: [
      '/menu-assets/img_p1_25.png',
      '/menu-assets/img_p1_31.png'
    ],
    isVerified: true,
    deviceType: 'Android',
    location: 'Cafe Regular',
    likes: 38,
    userLiked: false,
  },
  {
    id: 'rev-3',
    author: 'Rohan Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    date: '2026-10-08',
    relativeTime: '5 days ago',
    comment: 'Tried the Chef’s Special Non-Veg Burger and peri peri fries combo with their Cold Brew. Massive portion size, fresh toasted brioche bun, and perfectly melted cheese. Fast service too! Scanned the QR code at our table and had the food in under 12 minutes.',
    dishName: "Chef's Spl Non-Veg Burger",
    photos: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=800&auto=format&fit=crop'
    ],
    isVerified: true,
    deviceType: 'Mobile Phone',
    location: 'Weekend Foodie',
    likes: 29,
    userLiked: false,
  },
  {
    id: 'rev-4',
    author: 'Ananya Verma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    date: '2026-10-05',
    relativeTime: '1 week ago',
    comment: 'The stone-baked Margarita Pizza and White Alfredo Pasta were 10/10! Crispy crust with fresh basil and bubbling mozzarella. The staff is super warm and welcoming. Here are photos captured right from our dinner table!',
    dishName: 'Margarita Pizza & White Pasta',
    photos: [
      '/menu-assets/img_p1_23.png',
      '/menu-assets/img_p1_33.png'
    ],
    isVerified: true,
    deviceType: 'iPhone',
    location: 'Food Critic',
    likes: 51,
    userLiked: false,
  },
  {
    id: 'rev-5',
    author: 'Karthik Rao',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    rating: 4,
    date: '2026-10-01',
    relativeTime: '2 weeks ago',
    comment: 'Ferrero Rocher Thickshake is decadence in a glass! Super thick, loaded with chopped hazelnuts and chocolate shavings. Great place to work remotely or catch up with friends. Cozy ambience and top-notch playlist.',
    dishName: 'Ferrero Rocher Shake',
    photos: [
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800&auto=format&fit=crop'
    ],
    isVerified: true,
    deviceType: 'Android',
    location: 'Coffee Enthusiast',
    likes: 21,
    userLiked: false,
  }
];
