import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
  Sparkles,
  Maximize2,
  X,
  BadgeCheck
} from 'lucide-react';

interface LiveFoodReelsProps {
  onOrderOnWhatsApp: (dishName: string, price: number, category: string) => void;
}

interface PreparationReelItem {
  id: string;
  dishName: string;
  category: string;
  videoSrc: string;
  posterUrl: string;
  price: number;
  prepTag: string;
  prepTime: string;
  badge: string;
  description: string;
  pinterestUrl: string;
}

const PREPARATION_REELS: PreparationReelItem[] = [
  {
    id: 'prep-pizza',
    dishName: 'Neapolitan Margherita & Tandoori Pizza',
    category: 'Pizza',
    videoSrc: '/videos/pizza-prep.mp4?v=hd2',
    posterUrl: '/videos/pizza-thumb.jpg',
    price: 229,
    prepTag: '48-Hr Fermented Dough',
    prepTime: '8 Mins',
    badge: 'Stone-Baked Live',
    description: 'Hand-stretched fermented dough, crushed San Marzano tomatoes, and fresh buffalo mozzarella fired at 450°C in our stone oven.',
    pinterestUrl: 'https://pin.it/6KyeC2ZwU'
  },
  {
    id: 'prep-coffee',
    dishName: 'Artisanal Cappuccino & Swan Latte Art',
    category: 'Coffee',
    videoSrc: '/videos/coffee-prep.mp4?v=hd2',
    posterUrl: '/videos/coffee-thumb.jpg',
    price: 99,
    prepTag: 'Single-Origin Arabica',
    prepTime: '4 Mins',
    badge: 'Barista Handcrafted',
    description: 'Precision double espresso extracted under 9 bars of pressure, combined with silky microfoam poured into signature swan latte art.',
    pinterestUrl: 'https://pin.it/6KyeC2ZwU'
  },
  {
    id: 'prep-burger',
    dishName: "Chef's Spl Gourmet Brioche Burger",
    category: 'Burger',
    videoSrc: '/videos/burger-prep.mp4?v=hd2',
    posterUrl: '/videos/burger-thumb.jpg',
    price: 199,
    prepTag: 'Toasted Butter Brioche',
    prepTime: '10 Mins',
    badge: 'Sizzling Grill',
    description: 'Flame-seared gourmet patty, melted gouda cheese, smokey house relish, and caramelized onions served on toasted brioche.',
    pinterestUrl: 'https://pin.it/6KyeC2ZwU'
  },
  {
    id: 'prep-mocktail',
    dishName: 'Blue Lagoon & Mint Mojito Coolers',
    category: 'Mocktails',
    videoSrc: '/videos/mocktail-prep.mp4?v=hd2',
    posterUrl: '/videos/mocktail-thumb.jpg',
    price: 99,
    prepTag: 'Sparkling Citrus Fizz',
    prepTime: '3 Mins',
    badge: 'Chilled Shaker',
    description: 'Fresh garden mint sprigs crushed with lime wedges, vibrant blue curacao syrup, and effervescent sparkling soda shaken over ice.',
    pinterestUrl: 'https://pin.it/6KyeC2ZwU'
  },
  {
    id: 'prep-chicken',
    dishName: '12-Spice Crispy Golden Fried Chicken',
    category: 'Fried Chicken',
    videoSrc: '/videos/chicken-prep.mp4?v=hd2',
    posterUrl: '/videos/chicken-thumb.jpg',
    price: 219,
    prepTag: 'Ultra Crunch Coating',
    prepTime: '12 Mins',
    badge: 'Secret Recipe',
    description: 'Overnight herb marinade, double-dusted in authentic seasoned spices, and golden fried for an ultra-crunchy, juicy bite.',
    pinterestUrl: 'https://pin.it/6KyeC2ZwU'
  },
  {
    id: 'prep-kunafa',
    dishName: 'Royal Lotus Biscoff Cheesy Kunafa',
    category: 'Kunafa',
    videoSrc: '/videos/kunafa-prep.mp4?v=hd2',
    posterUrl: '/videos/kunafa-thumb.jpg',
    price: 249,
    prepTag: 'Stretchy Sweet Cheese',
    prepTime: '10 Mins',
    badge: 'Signature Dessert',
    description: 'Golden shredded kataifi vermicelli pan-baked with gooey stretchy sweet cheese, drenched in warm Belgian Lotus Biscoff butter.',
    pinterestUrl: 'https://pin.it/3KnMhR8IF'
  }
];

export const LiveFoodReels: React.FC<LiveFoodReelsProps> = ({ onOrderOnWhatsApp }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [modalReel, setModalReel] = useState<PreparationReelItem | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const REEL_DURATION_MS = 6500; // 6.5 seconds per video before autoscrolling to next

  // Progress timer for active reel + auto-advance
  useEffect(() => {
    if (isPaused || modalReel !== null) return;

    setProgress(0);
    const intervalTime = 50; // update progress every 50ms
    const step = (intervalTime / REEL_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next video
          setActiveIndex((current) => (current + 1) % PREPARATION_REELS.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeIndex, isPaused, modalReel]);

  // Autoscroll container into view and play active video, pause others
  useEffect(() => {
    // Smooth autoscroll container so active card is centered
    const targetCard = cardRefs.current[activeIndex];
    const container = containerRef.current;
    if (targetCard && container) {
      const scrollOffset = targetCard.offsetLeft - container.clientWidth / 2 + targetCard.clientWidth / 2;
      container.scrollTo({ left: Math.max(0, scrollOffset), behavior: 'smooth' });
    }

    // Play active video, pause all other videos
    videoRefs.current.forEach((videoEl, idx) => {
      if (!videoEl) return;
      if (idx === activeIndex) {
        videoEl.muted = isMuted;
        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay policy prevented playback with audio, keep muted
            videoEl.muted = true;
            videoEl.play().catch(() => {});
          });
        }
      } else {
        videoEl.pause();
      }
    });
  }, [activeIndex, isMuted]);

  // Handle mute toggling for active video
  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
    const activeVideo = videoRefs.current[activeIndex];
    if (activeVideo) {
      activeVideo.muted = !isMuted;
    }
  };

  const handlePrev = () => {
    setProgress(0);
    setActiveIndex((prev) => (prev === 0 ? PREPARATION_REELS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setProgress(0);
    setActiveIndex((prev) => (prev + 1) % PREPARATION_REELS.length);
  };

  const handleSelectReel = (idx: number) => {
    setProgress(0);
    setActiveIndex(idx);
  };

  return (
    <section id="live-reels" className="py-20 sm:py-24 bg-[#EDE0CC] relative overflow-hidden scroll-mt-16">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-0 w-80 sm:w-96 h-80 sm:h-96 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-caramel/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/25 text-terracotta text-xs font-bold uppercase tracking-widest mb-3">
            <Flame className="w-3.5 h-3.5 fill-terracotta" />
            <span>Live Kitchen Preparation</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-950 mb-3 leading-tight">
            Live Food Preparation & Culinary Reels
          </h2>

          <p className="text-sm sm:text-base text-coffee-800 leading-relaxed max-w-2xl mx-auto font-normal">
            Watch our master chefs handcraft every specialty live in HD — stone-baked pizzas, extracted espresso latte art, flame-grilled brioche burgers, chilled mocktails, crispy fried chicken, and sizzling Lotus Biscoff kunafa.
          </p>
        </div>

        {/* Story Progress Indicators & Header Controls */}
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
          {/* Segmented Story Progress Bars */}
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2 mb-3 sm:mb-4 px-1">
            {PREPARATION_REELS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectReel(idx)}
                className="group py-1 cursor-pointer focus:outline-none"
                title={`Jump to ${item.dishName}`}
              >
                <div className="h-1.5 sm:h-2 rounded-full bg-espresso-950/20 overflow-hidden transition-all group-hover:bg-espresso-950/30">
                  <div
                    className="h-full bg-terracotta rounded-full transition-all duration-75"
                    style={{
                      width:
                        idx === activeIndex
                          ? `${progress}%`
                          : idx < activeIndex
                          ? '100%'
                          : '0%'
                    }}
                  />
                </div>
                <span className="hidden md:block text-[10px] font-bold text-coffee-700 truncate mt-1 text-center group-hover:text-terracotta transition-colors">
                  {item.category}
                </span>
              </button>
            ))}
          </div>

          {/* Reel Control Bar: Active Title + Pause/Resume + Mute/Unmute */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-3 sm:px-5 py-2.5 rounded-2xl bg-white/80 border border-terracotta/20 backdrop-blur-md shadow-sm text-xs">
            {/* Live Indicator & Current Playing Dish */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
              </span>
              <span className="font-bold text-espresso-950 uppercase tracking-wider text-[11px] truncate">
                Now Playing: <span className="text-terracotta">{PREPARATION_REELS[activeIndex].dishName}</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-300">
                <BadgeCheck className="w-3 h-3 text-emerald-600" />
                <span>HD Clarity</span>
              </span>
            </div>

            {/* Controls: Prev / Pause / Next / Sound / Full HD */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 sm:p-2 rounded-full bg-white hover:bg-terracotta hover:text-white border border-terracotta/20 text-espresso-900 transition-colors shadow-xs"
                title="Previous preparation video"
                aria-label="Previous video"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className={`p-1.5 sm:p-2 rounded-full border transition-colors shadow-xs ${
                  isPaused
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white hover:bg-terracotta hover:text-white border-terracotta/20 text-espresso-900'
                }`}
                title={isPaused ? 'Resume autoscroll' : 'Pause autoscroll'}
                aria-label={isPaused ? 'Resume autoscroll' : 'Pause autoscroll'}
              >
                {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 sm:p-2 rounded-full bg-white hover:bg-terracotta hover:text-white border border-terracotta/20 text-espresso-900 transition-colors shadow-xs"
                title="Next preparation video"
                aria-label="Next video"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-terracotta/20 mx-1" />

              <button
                type="button"
                onClick={handleToggleMute}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-[11px] font-bold transition-all shadow-xs ${
                  !isMuted
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-espresso-800 border-terracotta/25 hover:border-terracotta'
                }`}
                title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-espresso-700" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound On'}</span>
              </button>

              <button
                type="button"
                onClick={() => setModalReel(PREPARATION_REELS[activeIndex])}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-espresso-900 hover:bg-espresso-950 text-white text-[11px] font-bold shadow-xs transition-colors"
                title="Watch in Fullscreen HD Modal"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Full HD</span>
              </button>
            </div>
          </div>
        </div>

        {/* Autoscrolling Horizontal Reels Showcase Track */}
        <div
          ref={containerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4 px-2 sm:px-6 -mx-4 sm:mx-0"
          style={{ scrollPadding: '0 2rem' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {PREPARATION_REELS.map((reel, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={reel.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                onClick={() => handleSelectReel(idx)}
                className={`snap-center shrink-0 w-[86vw] max-w-[340px] sm:w-[350px] md:w-[380px] rounded-3xl overflow-hidden bg-white transition-all duration-500 cursor-pointer flex flex-col ${
                  isActive
                    ? 'ring-4 ring-terracotta shadow-2xl scale-[1.02] border-transparent'
                    : 'border border-terracotta/20 opacity-80 hover:opacity-100 hover:scale-[1.01] shadow-md'
                }`}
              >
                {/* Video Reel Stage: 4:5 Portrait Ratio for Cinematic HD Food Clarity */}
                <div className="relative aspect-[4/5] w-full bg-black overflow-hidden group/video">
                  <video
                    ref={(el) => {
                      videoRefs.current[idx] = el;
                    }}
                    src={reel.videoSrc}
                    poster={reel.posterUrl}
                    playsInline
                    loop
                    muted={isMuted}
                    preload="auto"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover/video:scale-105"
                  />

                  {/* Gradient overlays for crisp text legibility without obscuring food */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35 pointer-events-none" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-espresso-950/85 backdrop-blur-md text-amber-200 border border-amber-300/30 text-[11px] font-bold uppercase tracking-wider shadow">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{reel.badge}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-white font-extrabold text-[10px] uppercase tracking-wider shadow">
                        HD 720p
                      </span>
                      <span className="px-3 py-1 rounded-full bg-terracotta text-white font-display font-bold text-sm shadow-md">
                        ₹{reel.price}
                      </span>
                    </div>
                  </div>

                  {/* Active Autoplaying Indicator */}
                  {isActive && (
                    <div className="absolute top-12 left-3 z-10 pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        <span>LIVE AUTOPLAY</span>
                      </span>
                    </div>
                  )}

                  {/* Quick Expand Button to Full HD */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalReel(reel);
                    }}
                    className="absolute top-12 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-terracotta text-white backdrop-blur-md transition-all shadow-md group-hover/video:opacity-100 sm:opacity-90 opacity-100"
                    title="Watch in Fullscreen HD"
                    aria-label="Fullscreen HD"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Inactive Overlay with Play Prompt */}
                  {!isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 group-hover/video:bg-black/15 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-white/90 text-espresso-950 flex items-center justify-center shadow-xl group-hover/video:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5 text-terracotta" />
                      </div>
                    </div>
                  )}

                  {/* Bottom Video Text Overlay */}
                  <div className="absolute bottom-3 inset-x-3 z-10 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-white">
                        {reel.prepTag}
                      </span>
                      <span className="text-[11px] text-amber-200 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{reel.prepTime}</span>
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-white text-base sm:text-lg leading-snug drop-shadow-md">
                      {reel.dishName}
                    </h3>
                  </div>
                </div>

                {/* Card Body & Instant Ordering Controls */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
                  <p className="text-xs sm:text-sm text-coffee-800 line-clamp-2 leading-relaxed mb-4">
                    {reel.description}
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-espresso-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalReel(reel);
                      }}
                      className="px-3 py-2 rounded-xl bg-parchment-200 hover:bg-parchment-300 text-espresso-950 text-xs font-bold transition-colors shadow-xs inline-flex items-center gap-1.5"
                      title="Expand HD video"
                    >
                      <Maximize2 className="w-3 h-3 text-terracotta" />
                      <span>HD View</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOrderOnWhatsApp(reel.dishName, reel.price, reel.category);
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-emerald-300 text-emerald-300" />
                      <span>Order (WhatsApp)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Category Selector Quick Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 sm:mt-8">
          {PREPARATION_REELS.map((reel, idx) => (
            <button
              key={reel.id}
              type="button"
              onClick={() => handleSelectReel(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                idx === activeIndex
                  ? 'bg-terracotta text-white border-terracotta shadow-md scale-105'
                  : 'bg-white text-espresso-800 border-terracotta/20 hover:border-terracotta hover:bg-parchment-200'
              }`}
            >
              <span>{reel.category}</span>
              <span className="ml-1.5 text-[10px] opacity-75">₹{reel.price}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Full HD Video Modal */}
      <AnimatePresence>
        {modalReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-lg p-4 sm:p-6"
            onClick={() => setModalReel(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl bg-espresso-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setModalReel(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-terracotta text-white backdrop-blur-md transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Full HD Widescreen Video Player */}
              <div className="relative aspect-video w-full bg-black">
                <video
                  src={modalReel.videoSrc}
                  poster={modalReel.posterUrl}
                  autoPlay
                  controls
                  playsInline
                  loop
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Modal Body & Dish Info */}
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-espresso-900/90">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-terracotta text-white text-[11px] font-bold uppercase tracking-wider">
                      {modalReel.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-extrabold uppercase tracking-wider">
                      Full 720p HD
                    </span>
                    <span className="text-amber-200 text-xs font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{modalReel.prepTime} Prep</span>
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    {modalReel.dishName}
                  </h3>
                  <p className="text-sm text-espresso-200 max-w-lg">
                    {modalReel.description}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
                  <div className="text-2xl sm:text-3xl font-display font-extrabold text-amber-300">
                    ₹{modalReel.price}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onOrderOnWhatsApp(modalReel.dishName, modalReel.price, modalReel.category);
                      setModalReel(null);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-emerald-300 text-emerald-300" />
                    <span>Order on WhatsApp</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
