import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Camera,
  Upload,
  CheckCircle2,
  Trash2,
  Smartphone,
  Sparkles,
  Coffee,
  AlertCircle
} from 'lucide-react';
import { Product } from '../types/product';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (reviewData: {
    author: string;
    rating: number;
    comment: string;
    dishName?: string;
    photos: string[];
    deviceType?: 'Mobile Phone' | 'iPhone' | 'Android' | 'Tablet' | 'Desktop';
    location?: string;
  }) => void;
  products?: Product[];
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmitReview,
  products = []
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [author, setAuthor] = useState('');
  const [dishName, setDishName] = useState('');
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detect user's device for the badge
  const getDeviceType = (): 'iPhone' | 'Android' | 'Mobile Phone' | 'Desktop' => {
    if (typeof window === 'undefined') return 'Desktop';
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iPhone';
    if (/Android/i.test(ua)) return 'Android';
    if (window.innerWidth < 768) return 'Mobile Phone';
    return 'Desktop';
  };

  const handleRatingClick = (star: number) => {
    setRating(star);
  };

  // Process image files from device
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMsg('');

    const maxPhotos = 6;
    if (photos.length + files.length > maxPhotos) {
      setErrorMsg(`You can upload up to ${maxPhotos} photos of your experience.`);
    }

    const remainingSlots = maxPhotos - photos.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please upload valid image files (JPG, PNG, WEBP).');
        return;
      }

      // Read as Data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          setPhotos((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Please share a few words about your coffee & food experience!');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      onSubmitReview({
        author: author.trim() || 'Foodie Guest',
        rating,
        comment: comment.trim(),
        dishName: dishName || 'Chef’s Special Recommendation',
        photos,
        deviceType: getDeviceType(),
        location: 'Verified Cafe Guest',
      });

      setIsSubmitting(false);
      setSubmittedSuccess(true);

      setTimeout(() => {
        setSubmittedSuccess(false);
        setRating(5);
        setAuthor('');
        setDishName('');
        setComment('');
        setPhotos([]);
        onClose();
      }, 1800);
    }, 600);
  };

  const ratingLabels: Record<number, string> = {
    1: 'Needs Improvement',
    2: 'Fair Experience',
    3: 'Good Cafe Taste',
    4: 'Very Good & Delicious!',
    5: 'Exceptional — Loved It!',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2B1B16]/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl my-8 bg-[#FAF6EE] border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#2B1B16] z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white text-[#6A584D] hover:text-[#2B1B16] hover:bg-amber-100 border border-amber-900/10 transition-colors"
              aria-label="Close review modal"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedSuccess ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mb-5 text-emerald-600">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-[#2B1B16] mb-2">
                  Thank You for Your Review!
                </h3>
                <p className="text-sm text-[#6A584D] max-w-md mx-auto">
                  Your ratings and experience photos have been published to the Coffee Land community.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300/60 text-[#802B12] text-xs font-semibold uppercase tracking-wider mb-2">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Share Your Cafe Story</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1B16]">
                    Rate Your Experience & Add Photos
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6A584D] mt-1">
                    Upload snapshots of your favorite coffee, pizza, or dessert straight from your phone or device!
                  </p>
                </div>

                {/* Star Rating Selector */}
                <div className="p-4 rounded-2xl bg-white border border-amber-900/15 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6A584D] mb-2">
                    How was your experience?
                  </span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingClick(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-transform hover:scale-125 focus:outline-none"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              isFilled
                                ? 'text-amber-500 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                : 'text-neutral-300 hover:text-amber-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-bold text-[#802B12] mt-2">
                    {ratingLabels[hoverRating || rating]}
                  </span>
                </div>

                {/* Name & Dish Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2B1B16] uppercase tracking-wider mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/20 text-[#2B1B16] placeholder-[#6A584D]/50 text-sm focus:outline-none focus:border-[#802B12] shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B1B16] uppercase tracking-wider mb-1.5">
                      Dish / Drink Ordered
                    </label>
                    <input
                      type="text"
                      list="dish-suggestions"
                      value={dishName}
                      onChange={(e) => setDishName(e.target.value)}
                      placeholder="e.g. Lotus Biscoff Kunafa"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/20 text-[#2B1B16] placeholder-[#6A584D]/50 text-sm focus:outline-none focus:border-[#802B12] shadow-sm"
                    />
                    <datalist id="dish-suggestions">
                      <option value="Cappuccino" />
                      <option value="Lotus Biscoff Kunafa" />
                      <option value="Sizzling Chocolate Brownie" />
                      <option value="Chef's Spl Non-Veg Burger" />
                      <option value="Tandoori Paneer Pizza" />
                      <option value="Ferrero Rocher Shake" />
                      <option value="Margarita Pizza" />
                      <option value="Cold Brew" />
                      <option value="White Pasta (Alfredo)" />
                      <option value="Fried Chicken Combo" />
                      <option value="Brownie Kit-Kat Waffle" />
                      <option value="Chicken Schezwan Fried Rice" />
                    </datalist>
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-xs font-semibold text-[#2B1B16] uppercase tracking-wider mb-1.5">
                    Your Experience & Review *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe the flavors, texture, latte art, presentation, or ambience..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-amber-900/20 text-[#2B1B16] placeholder-[#6A584D]/50 text-sm focus:outline-none focus:border-[#802B12] resize-none shadow-sm"
                  />
                </div>

                {/* Photo Upload Area */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#2B1B16] uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-[#802B12]" />
                      <span>Upload Photos From Phone / Device</span>
                    </label>
                    <span className="text-xs text-[#6A584D] font-medium">
                      {photos.length}/6 photos
                    </span>
                  </div>

                  {/* Dropzone / Upload button */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-[#802B12]/30 hover:border-[#802B12] rounded-2xl p-4 sm:p-5 text-center bg-white/70 hover:bg-white transition-all group shadow-sm"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300/60 flex items-center justify-center text-[#802B12] group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-[#2B1B16]">
                          Tap to select or take photos from your phone camera / gallery
                        </p>
                        <p className="text-[11px] text-[#6A584D] mt-0.5">
                          Supports JPG, PNG, WEBP — up to 6 pictures
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Photos Preview Grid */}
                  {photos.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mt-3">
                      {photos.map((photo, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-xl overflow-hidden border border-amber-900/20 group shadow-md"
                        >
                          <img
                            src={photo}
                            alt={`Upload ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-white/90 text-red-500 hover:text-red-700 hover:bg-white shadow transition-colors"
                            aria-label="Remove photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Device Info */}
                <div className="flex items-center justify-between text-xs text-[#6A584D] pt-2 border-t border-amber-900/10">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Smartphone className="w-3.5 h-3.5 text-[#802B12]" />
                    <span>Posting from {getDeviceType()}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#802B12]">Verified Guest Review</span>
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-amber-100 text-[#2B1B16] text-xs sm:text-sm font-semibold border border-amber-900/15 transition-colors shadow-sm"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl terracotta-btn text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Review & Photos'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
