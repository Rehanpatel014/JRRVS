import React, { useState } from 'react';
import { STUDENT_REVIEWS } from '../data/products';
import { StudentReview } from '../types';
import { Star, MessageSquarePlus, Check, X } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<StudentReview[]>(STUDENT_REVIEWS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    campus: '',
    productName: 'Heavyweight Boxy Tee (280 GSM)',
    sizePurchased: 'Size L',
    userStats: '',
    rating: 5,
    comment: '',
  });

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.author || !newReview.comment) return;

    const created: StudentReview = {
      id: `rev-${Date.now()}`,
      author: newReview.author,
      campus: newReview.campus || 'Campus Student',
      productName: newReview.productName,
      sizePurchased: newReview.sizePurchased,
      userStats: newReview.userStats || '6\'0", 160 lbs',
      rating: newReview.rating,
      date: 'Just now',
      comment: newReview.comment,
    };

    setReviews([created, ...reviews]);
    setShowAddModal(false);
    setNewReview({
      author: '',
      campus: '',
      productName: 'Heavyweight Boxy Tee (280 GSM)',
      sizePurchased: 'Size L',
      userStats: '',
      rating: 5,
      comment: '',
    });
  };

  return (
    <section className="py-20 border-b border-[#222428] bg-[#0c0d0e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#71717a] tracking-widest mb-1.5">
              <span>COMMUNITY REPUTATION</span>
              <span aria-hidden="true">·</span>
              <span>CAMPUS DORM VERIFIED</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
              Fit Checks & Student Feedback
            </h2>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 bg-[#18181b] hover:bg-[#27272a] text-xs font-mono text-white rounded border border-[#27272a] transition-colors"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Drop a Fit Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-[#121316] border border-[#1f2024] rounded-lg flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Rating Stars & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-[#3f3f46]'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-[#71717a]">{rev.date}</span>
                </div>

                {/* Comment */}
                <p className="text-xs text-[#d4d4d8] font-normal leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              {/* Reviewer Meta (Unboxed) */}
              <div className="pt-3 border-t border-[#1f2024] space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-white">{rev.author}</span>
                  <span className="text-[10px] font-mono text-emerald-400">Verified</span>
                </div>
                <div className="text-[10px] font-mono text-[#71717a]">
                  <span>{rev.campus}</span>
                  <span className="mx-1">·</span>
                  <span>{rev.userStats}</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 truncate">
                  Purchased: {rev.productName} ({rev.sizePurchased})
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Write a Review Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#121316] border border-[#222428] rounded-xl p-6 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 text-[#a1a1aa] hover:text-white rounded-full bg-[#1c1d22]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-heading text-xl font-bold uppercase tracking-tight mb-1">
              Submit Fit Review
            </h3>
            <p className="text-xs text-[#a1a1aa] font-mono mb-4">
              Help your campus peers select the right drape and size.
            </p>

            <form onSubmit={handleAddReview} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newReview.author}
                    onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                    placeholder="e.g. Liam S."
                    className="w-full bg-[#18191c] border border-[#27272a] rounded p-2 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                    Campus / University
                  </label>
                  <input
                    type="text"
                    value={newReview.campus}
                    onChange={(e) => setNewReview({ ...newReview, campus: e.target.value })}
                    placeholder="e.g. UCLA, Westwood"
                    className="w-full bg-[#18191c] border border-[#27272a] rounded p-2 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                    Your Height & Weight
                  </label>
                  <input
                    type="text"
                    value={newReview.userStats}
                    onChange={(e) => setNewReview({ ...newReview, userStats: e.target.value })}
                    placeholder="e.g. 6ft 1in, 170 lbs"
                    className="w-full bg-[#18191c] border border-[#27272a] rounded p-2 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                    Size Purchased
                  </label>
                  <select
                    value={newReview.sizePurchased}
                    onChange={(e) => setNewReview({ ...newReview, sizePurchased: e.target.value })}
                    className="w-full bg-[#18191c] border border-[#27272a] rounded p-2 text-xs font-mono text-white focus:outline-none"
                  >
                    <option value="Size S">Size S</option>
                    <option value="Size M">Size M</option>
                    <option value="Size L">Size L</option>
                    <option value="Size XL">Size XL</option>
                    <option value="Size XXL">Size XXL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newReview.rating
                            ? 'text-amber-400 fill-current'
                            : 'text-[#3f3f46]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                  How does it drape & survive the dorm wash?
                </label>
                <textarea
                  rows={3}
                  required
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share details on collar tightness, shoulder drop, fabric density..."
                  className="w-full bg-[#18191c] border border-[#27272a] rounded p-2 text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-white text-black font-mono text-xs uppercase tracking-widest font-bold rounded hover:bg-zinc-200 transition-colors"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
