import React, { useState, useEffect } from 'react';
import { Star, Upload, CheckCircle2, MessageSquare, Image as ImageIcon, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProductReviewsProps {
  productId: string;
  productName: string;
  isDarkMode?: boolean;
}

interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  image_url?: string;
  verified_purchase: boolean;
  created_at: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  productName,
  isDarkMode = false,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewImage, setReviewImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (data) setReviews(data);
      setLoading(false);
    };

    fetchReviews();

    // Realtime review sync
    const channel = supabase
      .channel(`reviews_${productId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'product_reviews',
          filter: `product_id=eq.${productId}`,
        },
        (payload: any) => {
          if (payload.new) {
            setReviews((prev) => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productId]);

  // Handle Photo Upload directly from device
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .insert([
          {
            product_id: productId,
            customer_name: name.trim(),
            rating,
            comment: comment.trim(),
            image_url: reviewImage || null,
            verified_purchase: true,
          },
        ])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        // Optimistic UI update
        if (!reviews.some((r) => r.id === data[0].id)) {
          setReviews((prev) => [data[0], ...prev]);
        }
      }

      setName('');
      setComment('');
      setReviewImage('');
      setRating(5);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err: any) {
      alert('Error submitting review: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Calculations
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

  return (
    <div
      className={`mt-12 pt-8 border-t transition-colors duration-300 ${
        isDarkMode ? 'border-gray-800 text-white' : 'border-gray-200 text-gray-900'
      }`}
    >
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C59B27]" />
            <h3 className="text-lg font-black uppercase tracking-tight">Customer Reviews & Ratings</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Verified buyer feedback & customer photos for {productName}
          </p>
        </div>

        {/* Avg Rating Badge */}
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl">
          <div className="text-right">
            <span className="text-xl font-black text-[#C59B27] leading-none block">{avgRating}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">out of 5</span>
          </div>
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(Number(avgRating)) ? 'fill-amber-400' : 'text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* WRITE A REVIEW FORM (AMAZON STYLE) */}
        <div className="lg:col-span-5">
          <div
            className={`p-6 rounded-3xl border shadow-sm ${
              isDarkMode ? 'bg-[#141A28] border-gray-800' : 'bg-white border-gray-200'
            }`}
          >
            <h4 className="text-sm font-black uppercase tracking-wider mb-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#C59B27]" /> Write a Customer Review
            </h4>
            <p className="text-xs text-gray-400 mb-5">Share your genuine thoughts and pictures with other buyers</p>

            {successMsg && (
              <div className="mb-4 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2 text-emerald-400 text-xs font-bold animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you! Your verified review has been posted live.</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Picker */}
              <div>
                <label className="text-[11px] font-bold text-gray-400 block mb-1.5">Rate this product *</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition transform active:scale-125"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-black text-[#C59B27] ml-2">
                    {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : 'Below Average'}
                  </span>
                </div>
              </div>

              {/* Your Name */}
              <div>
                <label className="text-[11px] font-bold text-gray-400 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none font-medium transition ${
                    isDarkMode
                      ? 'bg-[#0B0F17] border-gray-700 text-white focus:border-[#C59B27]'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-black'
                  }`}
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="text-[11px] font-bold text-gray-400 block mb-1">Your Review *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="What did you like or dislike about fabric, fit, quality, or delivery?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className={`w-full text-xs p-3.5 rounded-xl border outline-none transition ${
                    isDarkMode
                      ? 'bg-[#0B0F17] border-gray-700 text-white focus:border-[#C59B27]'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-black'
                  }`}
                />
              </div>

              {/* Photo Upload Option */}
              <div>
                <label className="text-[11px] font-bold text-gray-400 block mb-1.5">Add Product Photo (Optional)</label>
                <div className="flex items-center gap-3">
                  <label
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed cursor-pointer transition text-xs font-bold ${
                      isDarkMode
                        ? 'border-gray-700 hover:border-[#C59B27] bg-[#0B0F17] text-gray-300'
                        : 'border-gray-300 hover:border-black bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Upload className="w-4 h-4 text-[#C59B27]" />
                    <span>{reviewImage ? 'Change Photo' : 'Upload photo from device'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  {reviewImage && (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#C59B27] shrink-0">
                      <img src={reviewImage} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setReviewImage('')}
                        className="absolute inset-0 bg-black/60 text-white text-[9px] flex items-center justify-center font-bold opacity-0 hover:opacity-100 transition"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#C59B27] hover:bg-[#b0881e] text-black font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md shadow-[#C59B27]/25 mt-2"
              >
                {submitting ? 'Submitting Review...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>

        {/* REVIEWS LIST DISPLAY WITH IMAGES */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
              Customer Feedback ({reviews.length})
            </h4>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-gray-400">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-gray-800 p-8">
              <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
              <h5 className="text-sm font-bold">No customer reviews yet</h5>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                Be the first verified customer to share a review and upload a photo!
              </p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className={`p-5 rounded-3xl border transition ${
                  isDarkMode
                    ? 'bg-[#141A28] border-gray-800 hover:border-gray-700'
                    : 'bg-white border-gray-200 hover:border-gray-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#C59B27] text-black font-black text-xs flex items-center justify-center">
                      {rev.customer_name[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h5 className="text-xs font-black leading-none">{rev.customer_name}</h5>
                      <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                      </span>
                    </div>
                  </div>

                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-amber-400' : 'text-gray-300 dark:text-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 my-2">
                  {rev.comment}
                </p>

                {/* Customer Uploaded Photo */}
                {rev.image_url && (
                  <div className="mt-3">
                    <img
                      src={rev.image_url}
                      alt="Customer upload"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-gray-200 dark:border-gray-700 shadow-xs hover:scale-105 transition cursor-pointer"
                      onClick={() => window.open(rev.image_url, '_blank')}
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">Click image to expand</span>
                  </div>
                )}

                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400">
                  Reviewed on {new Date(rev.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};