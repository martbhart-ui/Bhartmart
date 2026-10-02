import React, { useState, useEffect } from 'react';
import {
  Star,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Share2,
  ArrowLeft,
  Upload,
  Camera,
  X,
  Play,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProductPageProps {
  product: any;
  allProducts: any[];
  onBackToHome: () => void;
  onSelectProduct: (product: any) => void;
  onAddToCart: (product: any) => void;
  onBuyNow: (product: any) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  allProducts,
  onBackToHome,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
}) => {
  const allMedia: string[] = [
    product.image_url,
    ...(Array.isArray(product.gallery_images) ? product.gallery_images : []),
  ].filter(Boolean);

  const [activeMedia, setActiveMedia] = useState<string>(allMedia[0] || '');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [added, setAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPhotoUrl, setReviewPhotoUrl] = useState('');
  const [uploadingReviewPhoto, setUploadingReviewPhoto] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Check whether size selection should be displayed
  const shouldShowSizes =
    product?.has_sizes !== undefined && product?.has_sizes !== null
      ? Boolean(product.has_sizes)
      : ['clothing', 'footwear', 't-shirts', 'hoodies', 'oversized', 'sneakers'].includes(
          (product?.category || '').toLowerCase()
        );

  const isVideo = (url: string) => {
    return url?.match(/\.(mp4|webm|ogg|mov)$/i) || url?.includes('video');
  };

  const loadProductReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', String(product.id))
        .order('created_at', { ascending: false });

      if (!error && data) {
        setReviews(data);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveMedia(product.image_url || allMedia[0] || '');
    loadProductReviews();
    document.body.style.overflow = 'auto';
  }, [product.id]);

  const handleReviewPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingReviewPhoto(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `review-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `reviews/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      setReviewPhotoUrl(data.publicUrl);
    } catch (err: any) {
      alert('Photo upload failed: ' + err.message);
    } finally {
      setUploadingReviewPhoto(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      alert('Please enter your name and review comment!');
      return;
    }

    setSubmittingReview(true);
    try {
      const newReview = {
        product_id: String(product.id),
        customer_name: reviewerName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        image_url: reviewPhotoUrl.trim() || null,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from('product_reviews').insert([newReview]).select();
      if (error) throw error;

      if (data && data[0]) {
        setReviews([data[0], ...reviews]);
      }

      setReviewerName('');
      setReviewComment('');
      setReviewPhotoUrl('');
      setShowReviewForm(false);
      alert('Thank you! Your review is now live.');
    } catch (err: any) {
      alert('Review submit error: ' + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleShareProduct = () => {
    const shareUrl = `${window.location.origin}/?product=${product.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Check out ${product.name} on BHART MART!`,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || !product.category))
    .slice(0, 6);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / reviews.length).toFixed(1)
      : '4.8';

  const discountPercent = product.original_price
    ? Math.round(((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 font-sans pb-24">
      {/* 1. TOP BREADCRUMB NAVIGATION */}
      <div className="bg-[#141A28] border-b border-gray-800 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#C59B27]" /> Back to All Products
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShareProduct}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 border border-gray-700 transition cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#C59B27]" />}
              {copiedLink ? 'Link Copied!' : 'Share Product URL'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN AMAZON-STYLE PRODUCT SHOWCASE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT: MEDIA GALLERY */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {allMedia.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[550px] scrollbar-none shrink-0">
                {allMedia.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMedia(url)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition cursor-pointer shrink-0 bg-[#141A28] ${
                      activeMedia === url ? 'border-[#C59B27] shadow-lg shadow-[#C59B27]/20 scale-105' : 'border-gray-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {isVideo(url) ? (
                      <div className="w-full h-full flex items-center justify-center bg-black/50 relative">
                        <video src={url} muted className="w-full h-full object-cover pointer-events-none" />
                        <Play className="w-5 h-5 text-white absolute fill-white drop-shadow" />
                      </div>
                    ) : (
                      <img src={url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 bg-[#141A28] rounded-3xl border border-gray-800 overflow-hidden relative aspect-square flex items-center justify-center shadow-2xl">
              {isVideo(activeMedia) ? (
                <video
                  src={activeMedia}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeMedia}
                  alt={product.name}
                  className="w-full h-full object-cover transition duration-300 hover:scale-105"
                />
              )}

              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <span className="bg-[#C59B27] text-black text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                  100% Genuine
                </span>
                {discountPercent > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: BUY BOX */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border-b border-gray-800/80 pb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#C59B27]/10 text-[#C59B27] text-[10px] font-black uppercase tracking-widest border border-[#C59B27]/20">
                  {product.category || 'Curated Drop'}
                </span>
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                  In Stock • Ready to Ship
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-snug tracking-tight">
                {product.name}
              </h1>

              {/* RATING STARS */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-400">{avgRating} out of 5</span>
                <span className="text-xs text-gray-500">•</span>
                <span
                  className="text-xs text-gray-400 underline cursor-pointer"
                  onClick={() => {
                    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {reviews.length} Verified Reviews
                </span>
              </div>
            </div>

            <div className="p-5 bg-[#141A28] border border-gray-800 rounded-3xl space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-[#C59B27]">
                  ₹{product.price}
                </span>
                {product.original_price && (
                  <span className="text-base text-gray-500 line-through">
                    ₹{product.original_price}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-black text-emerald-400">
                    Save ₹{Number(product.original_price) - Number(product.price)} ({discountPercent}% OFF)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400">Inclusive of all taxes & free shipping across India</p>
            </div>

            <div className="space-y-4">
              {/* CONDITIONAL SIZES SECTION */}
              {shouldShowSizes && (
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-wider block mb-2">
                    Select Size
                  </label>
                  <div className="flex gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-12 h-11 rounded-2xl text-xs font-black transition cursor-pointer border ${
                          selectedSize === sz
                            ? 'bg-[#C59B27] text-black border-[#C59B27] shadow-lg shadow-[#C59B27]/20 scale-105'
                            : 'bg-[#141A28] text-gray-300 border-gray-800 hover:border-gray-600'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    onAddToCart({
                      ...product,
                      selectedSize: shouldShowSizes ? selectedSize : undefined,
                    });
                    setAdded(true);
                    setTimeout(() => setAdded(false), 2000);
                  }}
                  className="py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-gray-700 transition cursor-pointer shadow-lg"
                >
                  {added ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4 text-[#C59B27]" />}
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </button>

                <button
                  onClick={() =>
                    onBuyNow({
                      ...product,
                      selectedSize: shouldShowSizes ? selectedSize : undefined,
                    })
                  }
                  className="py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-[#C59B27] hover:brightness-110 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#C59B27]/30 transition cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-black" /> Buy Now (COD / UPI)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-[#141A28] border border-gray-800 rounded-2xl text-center text-[10px] font-bold text-gray-400">
              <div className="flex flex-col items-center gap-1.5">
                <Truck className="w-5 h-5 text-[#C59B27]" />
                <span>Cash on Delivery Available</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-[#C59B27]" />
                <span>100% Genuine Brand</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <RotateCcw className="w-5 h-5 text-[#C59B27]" />
                <span>7 Days Easy Return</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. PRODUCT SPECIFICATIONS */}
        <div className="mt-16 bg-[#141A28] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base sm:text-lg font-black text-[#C59B27] uppercase tracking-wider border-b border-gray-800 pb-3 flex items-center gap-2">
            Product Details & Specifications
          </h2>

          <div className="space-y-3">
            {(product.description || '')
              .split('\n')
              .map((line: string) => line.trim())
              .filter((line: string) => line.length > 0 && !line.toLowerCase().includes('product details & description'))
              .map((line: string, index: number) => {
                // Agar line me ":" hai (jaise Color: Jet Black, Fabric: Cotton)
                if (line.includes(':')) {
                  const [key, ...val] = line.split(':');
                  return (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-800/60 text-xs sm:text-sm">
                      <span className="font-bold text-gray-400 sm:w-1/3 tracking-wide">{key.trim()}</span>
                      <span className="text-white font-medium sm:w-2/3 mt-0.5 sm:mt-0">{val.join(':').trim()}</span>
                    </div>
                  );
                }

                // Normal text ya bullet points
                return (
                  <p key={index} className="text-xs sm:text-sm text-gray-300 leading-relaxed flex items-start gap-2">
                    <span className="text-[#C59B27] mt-1 shrink-0">•</span>
                    <span>{line.replace(/^[-•*]\s*/, '')}</span>
                  </p>
                );
              })}

            {!product.description && (
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Premium quality verified product. Engineered with superior materials for durability, modern aesthetics and ultimate comfort.
              </p>
            )}
          </div>
        </div>

        {/* 4. CUSTOMER REVIEWS & PHOTOS */}
        <div id="reviews-section" className="mt-16 bg-[#141A28] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-6">
            <div>
              <h2 className="text-xl font-black text-white">Customer Reviews & Photos</h2>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
  key={s}
  className={`w-4 h-4 ${
    s <= Math.round(Number(avgRating || 5))
      ? 'fill-amber-400 text-amber-400'
      : 'text-gray-700'
  }`}
/>
                  ))}
                </div>
                <span className="text-sm font-black text-white">{avgRating} out of 5</span>
                <span className="text-xs text-gray-400">({reviews.length} total customer reviews)</span>
              </div>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-6 py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-[#ea580c]/30 transition cursor-pointer flex items-center gap-2"
            >
              <Camera className="w-4 h-4" /> Write a Review & Add Photos
            </button>
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="p-6 bg-[#111622] border border-gray-700 rounded-3xl space-y-5 animate-fadeIn">
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Rate this Product & Share Your Experience
                </h3>
                <button type="button" onClick={() => setShowReviewForm(false)}>
                  <X className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1.5">Overall Rating *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 cursor-pointer transition hover:scale-125"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-400 ml-2">
                    {reviewRating === 5
                      ? '5 Stars (Excellent)'
                      : reviewRating === 4
                      ? '4 Stars (Good)'
                      : reviewRating === 3
                      ? '3 Stars (Average)'
                      : `${reviewRating} Stars`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-gray-700 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">
                    Upload Product Photo (Optional)
                  </label>
                  <label className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-gray-700 hover:border-orange-500 transition cursor-pointer text-xs text-gray-400">
                    <span>{uploadingReviewPhoto ? 'Uploading Photo...' : reviewPhotoUrl ? 'Photo Attached ✓' : 'Choose Photo from Device'}</span>
                    <Upload className="w-4 h-4 text-orange-400" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReviewPhotoUpload}
                      disabled={uploadingReviewPhoto}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {reviewPhotoUrl && (
                <div className="flex items-center gap-3 p-2 bg-[#0B0F17] rounded-xl border border-gray-800">
                  <img src={reviewPhotoUrl} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-orange-500" />
                  <span className="text-xs text-emerald-400 font-bold">Photo successfully uploaded and ready to publish!</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Write your Review *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="What did you like or dislike? How is the quality, fitting, and delivery?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-[#0B0F17] border border-gray-700 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-5 py-2.5 bg-white/5 text-gray-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview || uploadingReviewPhoto}
                  className="px-7 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
                >
                  {submittingReview ? 'Publishing...' : 'Submit Review'}
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-8">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              reviews.map((rev) => {
  // Name fallback (customer_name / user_name / reviewer_name)
  const displayName =
    rev.customer_name ||
    rev.user_name ||
    rev.reviewer_name ||
    'Verified Buyer';

  // Photo fallback (image_url / review_images array / photo_url)
  const reviewPhoto =
    rev.image_url ||
    (Array.isArray(rev.review_images) && rev.review_images.length > 0
      ? rev.review_images[0]
      : null) ||
    rev.photo_url ||
    rev.photo;

  return (
    <div
      key={rev.id || Math.random()}
      className="p-5 bg-[#111622] border border-gray-800 rounded-2xl space-y-3 shadow-sm"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#C59B27]/20 text-[#C59B27] font-black text-xs flex items-center justify-center border border-[#C59B27]/30">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">{displayName}</h4>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              ✓ Verified Purchase
            </span>
          </div>
        </div>
        <span className="text-[10px] text-gray-500">
          {new Date(rev.created_at || Date.now()).toLocaleDateString()}
        </span>
      </div>

      <div className="flex text-amber-400">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-3.5 h-3.5 ${
              s <= Number(rev.rating || 5)
                ? 'fill-amber-400'
                : 'text-gray-700'
            }`}
          />
        ))}
      </div>

      <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
        {rev.comment}
      </p>

      {/* Customer Review Image Render */}
      {reviewPhoto && (
        <div className="pt-2">
          <div className="relative inline-block group">
            <img
              src={reviewPhoto}
              alt="Customer review photo"
              className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl border border-gray-700 shadow-md cursor-pointer group-hover:border-[#C59B27] group-hover:scale-105 transition-all duration-300"
              onClick={() => window.open(reviewPhoto, '_blank')}
            />
          </div>
          <span className="text-[10px] text-gray-500 mt-1.5 block">
            Click photo to view full image
          </span>
        </div>
      )}
    </div>
  );
})
            )}
          </div>
        </div>

        {/* 5. RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <h2 className="text-xl font-black text-white uppercase tracking-wider border-b border-gray-800 pb-3">
              Frequently Bought Together & Related Items
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="p-3 bg-[#141A28] border border-gray-800 rounded-2xl flex flex-col justify-between group hover:border-[#C59B27] transition cursor-pointer shadow-md"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-black/40 mb-2">
                    {isVideo(rel.image_url) ? (
                      <video src={rel.image_url} muted className="w-full h-full object-cover" />
                    ) : (
                      <img src={rel.image_url} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#C59B27] transition">
                      {rel.name}
                    </h4>
                    <span className="text-xs font-black text-[#C59B27] block mt-1">₹{rel.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};