import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface BannerItem {
  id?: string | number;
  title?: string;
  subtitle?: string;
  tag?: string;
  category?: string;
  target_category?: string;
  button_text?: string;
  btn_text?: string;
  image_url?: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  btn_bg?: string;
  btn_text_color?: string;
}

interface HeroCarouselProps {
  banners: BannerItem[];
  onBannerClick?: (category: any) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ banners, onBannerClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-play interval for slides
  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentIndex] || banners[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  // Fixed Banner click handler with event bubbling protection
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const targetCat =
      currentBanner.target_category ||
      currentBanner.category ||
      'All';

    if (onBannerClick) {
      onBannerClick(targetCat);
    }

    const section = document.getElementById('products-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 580, behavior: 'smooth' });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const mediaSource = currentBanner.media_url || currentBanner.image_url || '';
  const isVideo =
    currentBanner.media_type === 'video' ||
    Boolean(mediaSource.match(/\.(mp4|webm|ogg|mov)$/i)) ||
    mediaSource.includes('video');

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-6 select-none">
      <div
        onClick={handleActionClick}
        className="relative w-full h-[380px] sm:h-[480px] md:h-[520px] rounded-3xl overflow-hidden shadow-2xl bg-neutral-950 cursor-pointer group transition-all duration-500"
      >
        {/* MEDIA LAYER (VIDEO OR IMAGE) */}
        {isVideo ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <video
              ref={videoRef}
              src={mediaSource}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-1000"
            />
            <button
              type="button"
              onClick={toggleMute}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          mediaSource && (
            <img
              src={mediaSource}
              alt={currentBanner.title || 'Hero Banner'}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
            />
          )
        )}

        {/* MODERN DUAL GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent flex flex-col justify-center p-6 sm:p-12 md:p-16 z-10">
          <div className="max-w-xl space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* TAG BADGE */}
            {currentBanner.tag && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C59B27] text-xs font-black uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentBanner.tag}</span>
              </div>
            )}

            {/* HERO TITLE */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] uppercase tracking-tight drop-shadow-md">
              {currentBanner.title || 'Exclusive Streetwear Drop'}
            </h1>

            {/* HERO SUBTITLE */}
            {currentBanner.subtitle && (
              <p className="text-xs sm:text-sm md:text-base text-gray-300 font-medium line-clamp-2 max-w-lg drop-shadow-sm">
                {currentBanner.subtitle}
              </p>
            )}

            {/* PRIMARY CALL TO ACTION BUTTON */}
            <div className="pt-2 sm:pt-3">
              <button
                type="button"
                onClick={handleActionClick}
                className="px-7 py-3 rounded-full font-black text-xs uppercase tracking-wider transition-all duration-300 transform active:scale-95 shadow-xl cursor-pointer inline-flex items-center gap-2.5 hover:opacity-90"
                style={{
                  backgroundColor: currentBanner.btn_bg || '#C59B27',
                  color: currentBanner.btn_text_color || '#000000',
                }}
              >
                <span>{currentBanner.button_text || currentBanner.btn_text || 'Shop Drop'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* LEFT / RIGHT NAVIGATION CHEVRONS */}
        {banners.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition cursor-pointer shadow-lg active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition cursor-pointer shadow-lg active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* BOTTOM INDICATOR DOTS */}
            <div className="absolute bottom-5 right-6 sm:right-10 z-20 flex items-center gap-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx ? 'w-7 bg-[#C59B27]' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};