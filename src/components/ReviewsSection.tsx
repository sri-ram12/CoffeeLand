import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Camera,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Smartphone,
  CheckCircle2,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Heart
} from 'lucide-react';
import { Review, ReviewStats } from '../types/review';

interface ReviewsSectionProps {
  reviews: Review[];
  stats: ReviewStats;
  onOpenReviewModal: () => void;
  onToggleLike: (reviewId: string) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  stats,
  onOpenReviewModal,
  onToggleLike,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'photos' | '5stars' | 'recent'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === 'photos') return r.photos && r.photos.length > 0;
    if (activeFilter === '5stars') return r.rating === 5;
    return true;
  });

  return (
    <section id="reviews" className="py-24 bg-[#EDE0CC] relative scroll-mt-12 overflow-hidden">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-caramel/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Google Maps Rating Badge */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/25 text-terracotta text-xs font-bold uppercase tracking-widest mb-4">
            <Camera className="w-3.5 h-3.5" />
            <span>Google Maps 4.7 ★ Rated Resto & Cafe</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-950 mb-3">
            Loved By Coffee & Food Lovers
          </h2>
          <p className="text-sm sm:text-base text-coffee-800 max-w-2xl mx-auto leading-relaxed">
            Real reviews and candid snapshots uploaded directly by our guests from their phones and tables at Coffee Land Resto & Cafe (Sangivalasa, Vizag).
          </p>
        </div>

        {/* Rating Breakdown & CTA Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 mb-12 border border-terracotta/20 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Overall Score with Google Maps reference */}
            <div className="md:col-span-4 text-center md:text-left flex flex-col items-center md:items-start justify-center border-b md:border-b-0 md:border-r border-terracotta/15 pb-6 md:pb-0 md:pr-8">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-5xl sm:text-6xl font-bold text-espresso-950">
                  {stats.averageRating}
                </span>
                <span className="text-terracotta text-xl font-bold">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 text-amber-500 fill-amber-500"
                  />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-coffee-700">
                Based on <strong className="text-espresso-950">263+ Google reviews</strong> &{' '}
                <strong className="text-terracotta">{stats.totalPhotos}</strong> guest photos
              </p>
            </div>

            {/* Star Distribution Progress Bars */}
            <div className="md:col-span-5 space-y-2">
              {[5, 4, 3, 2, 1].map((score) => {
                const count = stats.ratingsBreakdown[score as 1 | 2 | 3 | 4 | 5] || 0;
                const pct = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                return (
                  <div key={score} className="flex items-center gap-3 text-xs">
                    <span className="w-12 text-coffee-700 flex items-center gap-1 font-semibold">
                      <span>{score}</span>
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    </span>
                    <div className="flex-1 h-2.5 rounded-full bg-[#EDE0CC] overflow-hidden border border-terracotta/10">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-terracotta rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-coffee-600 text-[11px] font-mono font-bold">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Action CTA with Terracotta Button */}
            <div className="md:col-span-3 flex flex-col items-center md:items-end justify-center text-center md:text-right">
              <button
                onClick={onOpenReviewModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <Camera className="w-4 h-4" />
                <span>Upload Photos & Review</span>
              </button>
              <p className="text-[11px] text-coffee-700 mt-2 flex items-center gap-1 font-medium">
                <Smartphone className="w-3 h-3 text-terracotta" />
                <span>Take photos directly from your phone!</span>
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === 'all'
                  ? 'bg-terracotta text-white shadow-xs font-bold'
                  : 'bg-white text-espresso-800 border border-terracotta/20 hover:bg-[#EDE0CC]'
              }`}
            >
              All Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveFilter('photos')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeFilter === 'photos'
                  ? 'bg-terracotta text-white shadow-xs font-bold'
                  : 'bg-white text-espresso-800 border border-terracotta/20 hover:bg-[#EDE0CC]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>With Photos ({reviews.filter((r) => r.photos?.length > 0).length})</span>
            </button>
            <button
              onClick={() => setActiveFilter('5stars')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeFilter === '5stars'
                  ? 'bg-terracotta text-white shadow-xs font-bold'
                  : 'bg-white text-espresso-800 border border-terracotta/20 hover:bg-[#EDE0CC]'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>5 Stars ({reviews.filter((r) => r.rating === 5).length})</span>
            </button>
          </div>

          <div className="text-xs text-coffee-700 font-bold">
            Showing {filteredReviews.length} experiences
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 flex flex-col justify-between border border-terracotta/15 shadow-sm hover:shadow-md transition-all"
            >
              <div>
                {/* Review Header: User & Rating */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-terracotta/10 border border-terracotta/30 overflow-hidden flex items-center justify-center font-bold text-terracotta shrink-0">
                      {review.avatar ? (
                        <img
                          src={review.avatar}
                          alt={review.author}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        review.author.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-heading text-sm font-bold text-espresso-950">
                          {review.author}
                        </h4>
                        {review.isVerified && (
                          <span title="Verified Dine-in Experience">
                            <CheckCircle2
                              className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100"
                            />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-coffee-600">
                        <span>{review.relativeTime}</span>
                        {review.deviceType && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-coffee-700">
                              <Smartphone className="w-3 h-3 text-terracotta" />
                              <span>{review.deviceType}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 bg-[#EDE0CC] px-2 py-1 rounded-lg border border-terracotta/20">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-espresso-950">{review.rating}.0</span>
                  </div>
                </div>

                {/* Dish Tag */}
                {review.dishName && (
                  <div className="inline-block px-2.5 py-1 rounded-md bg-terracotta/10 border border-terracotta/20 text-terracotta text-[11px] font-bold mb-3">
                    🍽️ {review.dishName}
                  </div>
                )}

                {/* Comment Text */}
                <p className="text-xs sm:text-sm text-coffee-800 leading-relaxed mb-4">
                  “{review.comment}”
                </p>

                {/* Photos Thumbnails from Phone */}
                {review.photos && review.photos.length > 0 && (
                  <div className="mb-4">
                    <div className="text-[11px] font-bold text-coffee-700 mb-1.5 flex items-center gap-1">
                      <Camera className="w-3 h-3 text-terracotta" />
                      <span>Photos by customer:</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {review.photos.map((photo, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => setSelectedPhoto(photo)}
                          className="relative aspect-square rounded-xl overflow-hidden border border-terracotta/25 cursor-pointer group shadow-xs"
                        >
                          <img
                            src={photo}
                            alt={`${review.author}'s experience photo`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Review Footer / Like Action */}
              <div className="flex items-center justify-between pt-3 border-t border-terracotta/10 text-xs text-coffee-600">
                <span className="text-[11px] font-medium">{review.location || 'Cafe Guest'}</span>
                <button
                  onClick={() => onToggleLike(review.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                    review.userLiked
                      ? 'text-red-600 bg-red-50 font-bold'
                      : 'text-coffee-700 hover:text-red-500 hover:bg-[#EDE0CC]'
                  }`}
                  aria-label="Like review"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      review.userLiked ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                  <span>{review.likes} Helpful</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full-Screen Photo Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="fixed inset-0 bg-espresso-950/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-3xl max-h-[85vh] z-10 rounded-2xl overflow-hidden shadow-2xl border border-caramel/40"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-espresso-950/80 text-cream-100 hover:bg-black transition-colors z-20"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedPhoto}
                alt="Enlarged guest experience photo"
                className="w-full h-full max-h-[80vh] object-contain bg-espresso-950"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
